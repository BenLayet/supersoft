import Link from 'next/link'
import { countByState, nextStory, stateOf, storiesOf } from '@supersoft/domain'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { addFeature } from '../../actions'
import { Button, Card, Input, Page, Pill, Section } from '../../ui'
import { stateLabels } from './story-line'

export default async function FeaturesPage() {
  const { features, stories } = await inMemoryProjectStore.load()
  const next = nextStory(stories)
  const nextFeature = features.find((feature) => feature.id === next?.featureId)

  return (
    <Page title="Features">
      <Section title="What comes next">
        <Card>
          {next ? (
            <>
              <p className="text-sm">
                As a <strong>{next.role}</strong>, I want to {next.intention}, so that {next.reason}.
              </p>
              {nextFeature && (
                <Link
                  href={`/solution/features/${nextFeature.id}`}
                  className="mt-2 inline-block text-sm text-muted hover:text-accent"
                >
                  in {nextFeature.name} →
                </Link>
              )}
            </>
          ) : (
            <p className="text-sm italic text-muted">
              Nothing is waiting. Every story is under way or done.
            </p>
          )}
        </Card>
      </Section>

      <Section title={`Features — ${features.length}`}>
        {features.map((feature) => {
          const own = storiesOf(feature, stories)
          const counts = countByState(own)
          return (
            <Card key={feature.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/solution/features/${feature.id}`}
                    className="text-sm font-medium hover:text-accent"
                  >
                    {feature.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{feature.purpose}</p>
                  <p className="mt-2 text-sm text-muted">
                    {own.length === 0
                      ? 'No story yet — it describes nothing.'
                      : `${own.length} stories — ${counts.done} done, ${counts.in_progress} in progress, ${counts.to_do} to do.`}
                  </p>
                </div>
                <Pill tone={stateOf(feature, stories) === 'done' ? 'accent' : 'plain'}>
                  {stateLabels[stateOf(feature, stories)]}
                </Pill>
              </div>
            </Card>
          )
        })}
        <Card>
          <form action={addFeature} className="flex flex-col gap-2">
            <Input name="name" placeholder="One thing the application offers" />
            <Input name="purpose" placeholder="What it is for, in one line" />
            <div>
              <Button quiet>Add a feature</Button>
            </div>
          </form>
        </Card>
      </Section>
    </Page>
  )
}
