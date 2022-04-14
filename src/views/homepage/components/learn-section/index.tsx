import type { ReactElement } from 'react'
import type { TutorialCardProps } from '../tutorial-card'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import Heading from 'components/heading'
import StandaloneLink from 'components/standalone-link'
import TutorialCard from '../tutorial-card'
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
            <Heading level={2} size={500} weight="bold" slug={heading}>
              {heading}
            </Heading>
            <div className={s.introDescription}>{description}</div>
            <StandaloneLink
              href="/"
              text="Start learning"
              iconPosition="trailing"
              icon={<IconArrowRight16 />}
              color="secondary"
            />
          </header>
        </div>
      </div>

      <div className={s.tutorials}>
        <ul className={s.tutorialsList}>
          {tutorials.map((tutorial, index) => {
            return (
              <li key={index} className={s.tutorialsListItem}>
                <TutorialCard {...tutorial} />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
