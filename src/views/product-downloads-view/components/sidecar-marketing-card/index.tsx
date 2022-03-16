import { ReactElement } from 'react'
import slugify from 'slugify'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Card from 'components/card'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import MaybeInternalLink from 'components/maybe-internal-link'
import { SidecarMarketingCardProps } from './types'
import s from './sidecar-marketing-card.module.css'

const SidecarMarketingCard = ({
  title,
  subtitle,
  learnMoreLink,
  featuredDocsLinks,
}: SidecarMarketingCardProps): ReactElement => (
  <Card elevation="base">
    <Text className={s.cardTitle} size={300} weight="semibold">
      {title}
    </Text>
    <Text className={s.cardSubtitle} size={200} weight="regular">
      {subtitle}
    </Text>
    <StandaloneLink
      color="secondary"
      href={learnMoreLink}
      icon={<IconExternalLink16 />}
      iconPosition="trailing"
      openInNewTab
      textSize={200}
      text="Learn more"
    />
    <Text className={s.featuredDocsLabel} size={200} weight="semibold">
      Featured docs
    </Text>
    <ul className={s.featuredDocsLinksList}>
      {featuredDocsLinks.map(({ href, text }) => (
        <Text
          className={s.featuredDocsListItem}
          asElement="li"
          key={slugify(text)}
          size={200}
          weight="regular"
        >
          <MaybeInternalLink className={s.featuredDocsLink} href={href}>
            {text}
          </MaybeInternalLink>
        </Text>
      ))}
    </ul>
  </Card>
)

export type { SidecarMarketingCardProps }
export default SidecarMarketingCard
