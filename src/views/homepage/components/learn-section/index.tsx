import type { CSSProperties, ReactElement } from 'react'
import slugify from 'slugify'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { FeaturedLearnCard } from 'views/product-downloads-view/types'
import CollectionCard from 'components/collection-card'
import Heading from 'components/heading'
import StandaloneLink from 'components/standalone-link'
import TutorialCard from 'components/tutorial-card'
import s from './learn-section.module.css'

interface LearnSectionProps {
  media: ReactElement
  heading: string
  description: ReactElement
  learnCards: FeaturedLearnCard[]
}

export default function LearnSection({
  media,
  heading,
  description,
  learnCards,
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
              '--tutorials-count': learnCards.length,
            } as CSSProperties
          }
        >
          {learnCards.map((cardProps: FeaturedLearnCard) => {
            const { id, type } = cardProps
            return (
              <li key={id} className={s.tutorialsListItem}>
                {type === 'collection' && <CollectionCard {...cardProps} />}
                {type === 'tutorial' && <TutorialCard {...cardProps} />}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
