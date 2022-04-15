import type { CSSProperties, ReactElement } from 'react'
import slugify from 'slugify'
import type { Products } from '@hashicorp/platform-product-meta'
import type { TutorialCardProps } from '../tutorial-card'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import Heading from 'components/heading'
import StandaloneLink from 'components/standalone-link'
import TutorialCard from '../tutorial-card'
import s from './learn-section.module.css'

interface LearnSectionProps {
  product?: Products
  media: ReactElement
  heading: string
  description: ReactElement
  tutorials: Array<TutorialCardProps>
}

/**
 * Products whose text should be displayed with dark text color.
 */
const darkColorProducts = ['vault', 'waypoint', 'packer', 'nomad']

export default function LearnSection({
  product = 'hashicorp',
  media,
  heading,
  description,
  tutorials,
}: LearnSectionProps) {
  const color = darkColorProducts.includes(product) ? 'black' : 'white'
  return (
    <section
      className={s.learnSection}
      style={
        {
          '--background-color': `var(--token-color-${product}-brand)`,
          '--color': `var(--${color})`,
        } as CSSProperties
      }
    >
      <div className={s.intro}>
        <div className={s.introInner}>
          <div className={s.introMedia}>{media}</div>
          <header className={s.introContent}>
            <Heading
              level={2}
              size={500}
              weight="bold"
              slug={slugify(heading, { lower: true })}
            >
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
          {tutorials.map((tutorial) => {
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
