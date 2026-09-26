import { describe, expect, it } from 'vitest'
import { type Lookup, publicAddress } from './public-address'

const resolving =
  (ips: Record<string, readonly string[]>): Lookup =>
  async (hostname) =>
    ips[hostname] ?? [hostname]

const lookup = resolving({
  'example.org': ['93.184.215.14', '2606:2800:21f:cb07:6820:80da:af6b:8b2c'],
  'inside.example.org': ['10.0.0.7'],
  'both.example.org': ['93.184.215.14', '192.168.1.1'],
  localhost: ['127.0.0.1', '::1'],
})

describe('a public address', () => {
  it('is an https:// address whose machine is public, fetched from the machine that was checked', async () => {
    expect(await publicAddress('https://example.org/medito', lookup)).toEqual({
      url: 'https://example.org/medito',
      hostname: 'example.org',
      ip: '93.184.215.14',
    })
  })

  it('is never on this machine, a private network or a link-local address', async () => {
    for (const address of [
      'https://localhost/medito',
      'https://127.0.0.1/medito',
      'https://[::1]/medito',
      'https://10.1.2.3/medito',
      'https://172.20.0.1/medito',
      'https://192.168.1.1/medito',
      'https://169.254.169.254/latest/meta-data',
      'https://[fe80::1]/medito',
      'https://[fd00::1]/medito',
      'https://[::ffff:127.0.0.1]/medito',
      'https://0.0.0.0/medito',
    ]) {
      expect(await publicAddress(address, lookup), address).toBeUndefined()
    }
  })

  it('is never a name that stands for a machine that is not public, even among public ones', async () => {
    expect(await publicAddress('https://inside.example.org/medito', lookup)).toBeUndefined()
    expect(await publicAddress('https://both.example.org/medito', lookup)).toBeUndefined()
  })

  it('never has a port of its own, a name or a password', async () => {
    expect(await publicAddress('https://example.org:8443/medito', lookup)).toBeUndefined()
    expect(await publicAddress('https://maker:secret@example.org/medito', lookup)).toBeUndefined()
  })

  it('is always https://', async () => {
    expect(await publicAddress('http://example.org/medito', lookup)).toBeUndefined()
    expect(await publicAddress('ssh://git@example.org/medito.git', lookup)).toBeUndefined()
    expect(await publicAddress('/home/maker/medito', lookup)).toBeUndefined()
  })

  it('is nothing when its name stands for no machine', async () => {
    const nowhere: Lookup = async () => Promise.reject(new Error('not found'))
    expect(await publicAddress('https://nowhere.example.org/medito', nowhere)).toBeUndefined()
  })
})
