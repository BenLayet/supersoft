import { lookup as dnsLookup } from 'node:dns/promises'
import { BlockList, isIPv4, isIPv6 } from 'node:net'

/** The addresses a name stands for. Replaced in tests, so that none of them needs a network. */
export type Lookup = (hostname: string) => Promise<readonly string[]>

export const systemLookup: Lookup = async (hostname) =>
  (await dnsLookup(hostname, { all: true, verbatim: true })).map((found) => found.address)

/**
 * Every machine that is not on the public internet: this one, private networks,
 * link-local, reserved. One list per family: a list checks an IPv4 address
 * against its IPv6 ranges too, so `::ffff:0:0/96` would refuse them all.
 */
const notPublicV4 = new BlockList()
const notPublicV6 = new BlockList()
for (const [network, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.88.99.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const)
  notPublicV4.addSubnet(network, prefix, 'ipv4')
for (const [network, prefix] of [
  ['::', 128],
  ['::1', 128],
  ['::ffff:0:0', 96],
  ['64:ff9b::', 96],
  ['64:ff9b:1::', 48],
  ['100::', 64],
  ['2001::', 23],
  ['2001:db8::', 32],
  ['2002::', 16],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const)
  notPublicV6.addSubnet(network, prefix, 'ipv6')

const isPublic = (ip: string) =>
  isIPv4(ip) ? !notPublicV4.check(ip, 'ipv4') : isIPv6(ip) ? !notPublicV6.check(ip, 'ipv6') : false

/** A repository on the public internet: where to fetch it, and the one machine to fetch it from. */
export interface PublicAddress {
  readonly url: string
  readonly hostname: string
  readonly ip: string
}

/**
 * The address as a public repository, or nothing. Only `https://` on its usual
 * port, with no name or password in it, on a machine every one of whose
 * addresses is public: one private address is enough to refuse it.
 */
export const publicAddress = async (address: string, lookup: Lookup): Promise<PublicAddress | undefined> => {
  let url: URL
  try {
    url = new URL(address)
  } catch {
    return undefined
  }
  if (url.protocol !== 'https:' || url.port !== '' || url.username !== '' || url.password !== '') return undefined
  const hostname = url.hostname.replace(/^\[(.*)\]$/, '$1')
  if (hostname === '') return undefined

  let ips: readonly string[]
  try {
    ips = await lookup(hostname)
  } catch {
    return undefined
  }
  const [ip] = ips
  if (ip === undefined || !ips.every(isPublic)) return undefined
  return { url: url.href, hostname: url.hostname, ip }
}
