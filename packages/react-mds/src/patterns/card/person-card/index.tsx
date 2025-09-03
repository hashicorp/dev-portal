import { memo, type ReactNode } from 'react'
import { Text } from '@hashicorp/react-mds/src/components/text'
import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
import { IconTwitter16 } from '@hashicorp/flight-icons/svg-react/twitter-16'
import { IconLinkedin16 } from '@hashicorp/flight-icons/svg-react/linkedin-16'
import { IconLink16 } from '@hashicorp/flight-icons/svg-react/link-16'
import { IconMail16 } from '@hashicorp/flight-icons/svg-react/mail-16'
import type { ProductBadgesProps, ThumbnailProps } from '../types'
import * as CardPrimitives from '../primitives'
import s from './style.module.css'

interface PersonCardProps {
	thumbnail: ThumbnailProps
	link: string
	name: string
	location?: string
	bio?: string
	productBadges?: ProductBadgesProps['badges']
}

// Map of hostnames to icons.
/* eslint-disable react/jsx-key */
const iconMap = new Map<string, ReactNode>([
	// null signals that we don't want to render any icon
	['hashicorp.com', null],
	[
		'twitter.com',
		<IconTwitter16 data-testid={'wpl-personcard-twitter-icon'} />,
	],
	['github.com', <IconGithub16 data-testid={'wpl-personcard-github-icon'} />],
	[
		'linkedin.com',
		<IconLinkedin16 data-testid={'wpl-personcard-linkedin-icon'} />,
	],
	['mailto:', <IconMail16 data-testid={'wpl-personcard-mail-icon'} />],
])
/* eslint-enable react/jsx-key */

const Icon = memo(function Icon({ url }: { url: string }) {
	const { protocol, host } = new URL(url)
	const icon = iconMap.get(protocol === 'mailto:' ? 'mailto:' : host)

	// If the icon value is null, don't render an icon
	if (icon === null) {
		return null
	}

	// Render the icon or the default icon if the icon value is undefined
	return (
		<div className={s.thumbnailIcon}>
			{icon ?? <IconLink16 data-testid={'wpl-personcard-link-icon'} />}
		</div>
	)
})

const PersonCard = ({
	link,
	thumbnail,
	name,
	location,
	bio,
	productBadges,
}: PersonCardProps) => {
	return (
		<CardPrimitives.Card link={link} withArrow={false} aria-label={name}>
			<div className={s.thumbnailContainer}>
				<CardPrimitives.PersonThumbnail {...thumbnail} />
				<Icon url={link} />
			</div>
			<CardPrimitives.Content>
				<div>
					<CardPrimitives.Heading>{name}</CardPrimitives.Heading>
					{location ? (
						<Text.Body tag="p" size="200" className={s.location}>
							{location}
						</Text.Body>
					) : null}
				</div>
				{bio ? (
					<CardPrimitives.Description>{bio}</CardPrimitives.Description>
				) : null}
				{productBadges && productBadges?.length > 0 ? (
					<CardPrimitives.ProductBadges badges={productBadges} />
				) : null}
			</CardPrimitives.Content>
		</CardPrimitives.Card>
	)
}

export type { PersonCardProps }
export { PersonCard }
