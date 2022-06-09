import type { CSSProperties, ReactElement } from 'react'
import slugify from 'slugify'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import Heading from 'components/heading'
import StandaloneLink from 'components/standalone-link'
import TutorialCard from 'components/tutorial-card'
import { TutorialCardProps } from 'components/tutorial-card/types'
import s from './learn-section.module.css'

interface LearnSectionProps {
  media: ReactElement
  heading: string
  description: ReactElement
  tutorials: Array<TutorialCardProps>
}

export default function LearnSection({
  media,
  heading,
  description,
  tutorials,
}: LearnSectionProps) {
  return (
    <section className={s.learnSection}>
      <div className={s.intro}>
        <div className={s.introInner}>
          <div className={s.introMedia}>{media}</div>
          <header className={s.introContent}>
            <Heading
              level={2}
              size={500}
              weight="bold"
              id={slugify(heading, { lower: true })}
            >
              {heading}
            </Heading>
            <div className={s.introDescription}>{description}</div>
            <StandaloneLink
              href="/vault/tutorials/associate-cert"
              text="Start learning"
              iconPosition="trailing"
              icon={<IconArrowRight16 />}
              color="secondary"
            />
          </header>
        </div>
      </div>

      <div className={s.tutorials}>
        <ul
          className={s.tutorialsList}
          style={
            {
              '--tutorials-count': tutorials.length,
            } as CSSProperties
          }
        >
          {tutorials.map((tutorial: TutorialCardProps) => {
            return (
              <li
                key={slugify(tutorial.heading, { lower: true })}
                className={s.tutorialsListItem}
              >
                <TutorialCard {...tutorial} />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
