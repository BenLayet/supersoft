import Link from 'next/link'
import { countByState, nextStory, prototypesOf, stateOf, storiesOf } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { addFeature } from '@/app/actions'
import { StorySentence, storyHref } from '@/app/story-line'
import { Button, Card, Input, Page, Pill, Section } from '@/app/ui'

export default async function FeaturesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionary()
  const { features, stories } = project
  const next = nextStory(stories)
  const nextFeature = features.find((feature) => feature.id === next?.featureId)

  return (
    <Page title={t.features.title}>
      <Section title={t.overview.whatComesNext}>
        <Card>
          {next ? (
            <>
              <Link href={storyHref(project.id, next)} className="block text-sm hover:text-accent">
                <StorySentence story={next} language={project.language} />
              </Link>
              {nextFeature && (
                <Link
                  href={`/projects/${project.id}/features/${nextFeature.id}`}
                  className="mt-2 inline-block text-sm text-muted hover:text-accent"
                >
                  {t.features.inFeature(nextFeature.name)}
                </Link>
              )}
            </>
          ) : (
            <p className="text-sm italic text-muted">{t.overview.nothingWaiting}</p>
          )}
        </Card>
      </Section>

      <Section title={t.features.list(features.length)}>
        {features.map((feature) => {
          const own = storiesOf(feature, stories)
          const counts = countByState(own)
          const prototypes = prototypesOf(feature, project.prototypes)
          const validated = prototypes.filter((prototype) => prototype.state === 'validated')
          return (
            <Card key={feature.id}>
              <div className="flex items-start justify-between gap-3">
                <div lang={project.language}>
                  <Link
                    href={`/projects/${project.id}/features/${feature.id}`}
                    className="text-sm font-medium hover:text-accent"
                  >
                    {feature.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{feature.purpose}</p>
                </div>
                <Pill tone={stateOf(feature, stories) === 'done' ? 'accent' : 'plain'}>
                  {t.storyStates[stateOf(feature, stories)]}
                </Pill>
              </div>
              <p className="mt-2 text-sm text-muted">
                {own.length === 0
                  ? t.features.noStory
                  : t.features.storyCounts(own.length, counts.done, counts.in_progress, counts.to_do)}
              </p>
              {prototypes.length > 0 && (
                <p className="mt-1 text-sm text-muted">
                  {t.overview.prototypesSummary(prototypes.length - validated.length, validated.length)}
                </p>
              )}
            </Card>
          )
        })}
        {writable && (
          <Card>
            <form action={addFeature} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder={t.features.featureName} />
              <Input name="purpose" placeholder={t.features.featurePurpose} />
              <div>
                <Button quiet>{t.features.addFeature}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  )
}
