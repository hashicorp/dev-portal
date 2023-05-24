import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import CardLink from 'components/card-link'
import Tooltip from 'components/tooltip'
import Badge from 'components/badge'
import s from './tutorials-landing-content-card-link.module.css'
import { useId } from 'react'

type ContentCardLinkEyebrowPart = string

interface ContentCardLinkBadge {
	icon: $TSFixMe
	label: string
}

interface ContentCardLinkProps {
	href: string
	title: string
	eyebrowParts: ContentCardLinkEyebrowPart[]
	description: string
	badges: ContentCardLinkBadge[]
}

const TutorialsLandingContentCardLink = ({
	badges,
	description,
	eyebrowParts,
	href,
	title,
}: ContentCardLinkProps) => {
	const uniqueId = useId()

	return (
		<CardLink ariaLabel={title} className={s.root} href={href}>
			<div className={s.eyebrow}>
				{eyebrowParts.map(
					(eyebrowPart: ContentCardLinkEyebrowPart, index: number) => (
						// eslint-disable-next-line react/no-array-index-key
						<span key={`${uniqueId}-eyebrowPart-${index}`}>{eyebrowPart}</span>
					)
				)}
			</div>
			<h3 className={s.title}>{title}</h3>
			<p className={s.description}>{description}</p>
			<ul className={s.badges}>
				{badges.map(({ icon, label }: ContentCardLinkBadge) => (
					<Tooltip key={`${uniqueId}-badge-${label}`} label={label}>
						<Badge ariaLabel={label} icon={icon} size="small" />
					</Tooltip>
				))}
			</ul>
			<div className={s.icon}>
				<IconArrowRight24 />
			</div>
		</CardLink>
	)
}

export default TutorialsLandingContentCardLink
