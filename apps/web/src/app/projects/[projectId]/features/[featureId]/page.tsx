import { notFound } from 'next/navigation'
import { nextStory, prototypesOf, sizes, stateOf, storiesOf } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { addPrototype, addStory } from '@/app/actions'
import { PrototypeCard } from '@/app/prototype-card'
import { StoryLine } from '@/app/story-line'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/app/ui'

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ projectId: string; featureId: string }>
}) {
  const { projectId, featureId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionaryIn(project.language)
  const { features, stories } = project
  const feature = features.find((one) => one.id === featureId)
  if (!feature) notFound()

  const own = storiesOf(feature, stories)
  const prototypes = prototypesOf(feature, project.prototypes)
  const next = nextStory(stories)

  return (
    <Page
      title={feature.name}
      back={{ href: `/projects/${project.id}/features`, label: t.features.title }}
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
                  name="effort"
                  options={Object.fromEntries(sizes.map((size) => [size, t.story.effort(size)]))}
                  defaultValue="M"
                />
                <Select
                  name="value"
                  options={Object.fromEntries(sizes.map((size) => [size, t.story.value(size)]))}
                  defaultValue="M"
                />
                <Button quiet>{t.features.add}</Button>
              </div>
            </form>
          </Card>
        </Section>
      )}

      <Section title={t.prototypes.list(prototypes.length)}>
        {prototypes.length === 0 && <Empty>{t.prototypes.nothingToTry}</Empty>}
        {prototypes.map((prototype) => (
          <PrototypeCard
            key={prototype.id}
            prototype={prototype}
            projectId={project.id}
            language={project.language}
            writable={writable}
            t={t}
          />
        ))}
        {writable && (
          <Card>
            <form action={addPrototype} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="featureId" value={feature.id} />
              <Input name="name" placeholder={t.prototypes.name} />
              <Input name="location" placeholder={t.prototypes.location} required={false} />
              <div>
                <Button quiet>{t.prototypes.add}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  )
}
