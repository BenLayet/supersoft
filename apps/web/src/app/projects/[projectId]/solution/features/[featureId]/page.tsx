import { notFound } from 'next/navigation'
import { nextStory, stateOf, storiesOf } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { addStory } from '@/app/actions'
import { StoryLine } from '@/app/story-line'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/app/ui'

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ projectId: string; featureId: string }>
}) {
  const { projectId, featureId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionary()
  const { features, stories } = project
  const feature = features.find((one) => one.id === featureId)
  if (!feature) notFound()

  const own = storiesOf(feature, stories)
  const next = nextStory(stories)

  return (
    <Page
      title={feature.name}
      back={{ href: `/projects/${project.id}/solution/features`, label: t.features.title }}
    >
      <Section title={t.features.whatItIsFor}>
        <Card>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm" lang={project.language}>
              {feature.purpose}
            </p>
            <Pill tone={stateOf(feature, stories) === 'done' ? 'accent' : 'plain'}>
              {t.storyStates[stateOf(feature, stories)]}
            </Pill>
          </div>
        </Card>
      </Section>

      <Section title={t.features.stories(own.length)}>
        <Card>
          {own.length === 0 ? (
            <Empty>{t.features.describesNothing}</Empty>
          ) : (
            <div className="space-y-3">
              {own.map((story) => (
                <StoryLine
                  key={story.id}
                  projectId={project.id}
                  language={project.language}
                  story={story}
                  next={story.id === next?.id}
                  writable={writable}
                  t={t}
                />
              ))}
            </div>
          )}
        </Card>
      </Section>

      {writable && (
        <Section title={t.features.addStory}>
          <Card>
            <form action={addStory} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="featureId" value={feature.id} />
              <Input name="role" placeholder={t.features.role} />
              <Input name="intention" placeholder={t.features.intention} />
              <Input name="reason" placeholder={t.features.reason} />
              <div className="flex items-center gap-2">
                <Select
                  name="priority"
                  options={t.priorities}
                  defaultValue="expected"
                />
                <Button quiet>{t.features.add}</Button>
              </div>
            </form>
          </Card>
          <p className="text-xs text-muted">
            {t.features.priorityIsTheCustomers}
          </p>
        </Section>
      )}
    </Page>
  )
}
