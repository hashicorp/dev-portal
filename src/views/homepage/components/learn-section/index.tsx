import type { CSSProperties, ReactElement } from 'react'
import slugify from 'slugify'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import CollectionCard, {
  CollectionCardPropsWithId,
} from 'components/collection-card'
import Heading from 'components/heading'
import StandaloneLink from 'components/standalone-link'
import s from './learn-section.module.css'

interface LearnSectionProps {
  media: ReactElement
  heading: string
  description: ReactElement
  collectionCards: CollectionCardPropsWithId[]
}

export default function LearnSection({
  media,
  heading,
  description,
  collectionCards,
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
              '--tutorials-count': collectionCards.length,
            } as CSSProperties
          }
        >
          {collectionCards.map((cardProps: CollectionCardPropsWithId) => {
            const { id } = cardProps
            return (
              <li key={id} className={s.tutorialsListItem}>
                <CollectionCard {...cardProps} />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
