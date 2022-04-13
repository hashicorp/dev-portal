import Link from 'next/link'
import { VisuallyHidden } from '@reach/visually-hidden'
import type { ProductSlug } from 'types/products'
import { productSlugs } from 'lib/products'
import ProductIcon from 'components/product-icon'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import Badge from 'components/badge'
import CardLink from 'components/card-link'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './tutorial-card.module.css'

const getProductIcons = () => {
  const icons = {}
  for (const slug of productSlugs) {
    icons[slug] = <ProductIcon productSlug={slug} />
  }
  return icons
}

const BADGE_ICON_MAP = {
  ...getProductIcons(),
  video: <IconPlay16 />,
  interactive: <IconTerminalScreen16 />,
}

interface TutorialCardProps {
  link: string
  duration?: string
  heading: string
  description: string
  badges: Array<ProductSlug | 'video' | 'interactive'>
}

export default function TutorialCard({
  link,
  duration,
  heading,
  description,
  badges,
}: TutorialCardProps) {
  return (
    <CardLink href="/" className={s.tutorialCard}>
      {duration ? (
        <Text className={s.duration} size={100} weight="medium">
          {duration}
        </Text>
      ) : null}
      <Heading
        className={s.heading}
        level={3}
        size={200}
        weight="semibold"
        slug={heading}
      >
        {heading}
      </Heading>
      <Text className={s.description} size={100}>
        {description}
      </Text>
      <ul className={s.badgesList}>
        {badges.map((badge, index) => {
          return (
            <li key={index} className={s.badgesListItem}>
              <Badge
                ariaLabel={badge}
                icon={BADGE_ICON_MAP[badge]}
                className={s.badge}
              />
            </li>
          )
        })}
      </ul>
    </CardLink>
  )
}
