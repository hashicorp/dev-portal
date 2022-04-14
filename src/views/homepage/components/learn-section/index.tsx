import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import Heading from 'components/heading'
import StandaloneLink from 'components/standalone-link'
import TutorialCard from '../tutorial-card'
import s from './learn-section.module.css'

export default function LearnSection({ heading, description, tutorials }) {
  return (
    <section className={s.learnSection}>
      <div className={s.content}>
        <div className={s.container}>
          <Heading level={2} size={500} weight="bold" slug={heading}>
            {heading}
          </Heading>
          <div>{description}</div>
          <StandaloneLink
            href="/"
            text="Start learning"
            iconPosition="trailing"
            icon={<IconArrowRight16 />}
            color="secondary"
          />
        </div>
      </div>
      <ul className={s.tutorialsList}>
        {tutorials.map((tutorial, index) => {
          return (
            <li key={index} className={s.tutorialsListItem}>
              <TutorialCard {...tutorial} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
