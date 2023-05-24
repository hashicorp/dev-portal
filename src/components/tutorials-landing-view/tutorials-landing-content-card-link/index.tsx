import { useId } from '@react-aria/utils'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import Badge from 'components/badge'
import CardLink from 'components/card-link'
import Tooltip from 'components/tooltip'
import s from './tutorials-landing-content-card-link.module.css'

type ContentCardLinkEyebrowPart = string

interface ContentCardLinkBadge {
	icon: $TSFixMe
	label: string
}

interface ContentCardLinkProps {
	backgroundImageUrl?: string
	badges: ContentCardLinkBadge[]
	description: string
	eyebrowParts: ContentCardLinkEyebrowPart[]
	headerImageUrl?: string
	href: string
	title: string
}

const TutorialsLandingContentCardLink = ({
	backgroundImageUrl,
	badges,
	description,
	eyebrowParts,
	headerImageUrl,
	href,
	title,
}: ContentCardLinkProps) => {
	const uniqueId = useId()

	return (
		<CardLink ariaLabel={title} className={s.root} href={href}>
			{headerImageUrl ? (
				<div
					className={s.headerImage}
					style={{
						backgroundImage: `url(${headerImageUrl})`,
					}}
				/>
			) : null}
			<div
				className={s.content}
				style={
					backgroundImageUrl
						? {
								// TODO uncomment when there are svgs to send through
								// background: `url(${backgroundImageUrl})`,
								backgroundColor: 'lightgray',
								paddingTop: 44,
								height: '100%',
						  }
						: null
				}
			>
				<div>
					{eyebrowParts?.length > 0 ? (
						<div className={s.eyebrow}>
							{eyebrowParts.map(
								(eyebrowPart: ContentCardLinkEyebrowPart, index: number) => (
									<span
										className={s.eyebrowPart}
										// eslint-disable-next-line react/no-array-index-key
										key={`${uniqueId}-eyebrowPart-${index}`}
									>
										{eyebrowPart}
									</span>
								)
							)}
						</div>
					) : null}
					<h3 className={s.title}>{title}</h3>
					<p className={s.description}>{description}</p>
				</div>
				<div className={s.footer}>
					{badges?.length > 0 ? (
						<ul className={s.badgeList}>
							{badges.map(({ icon, label }: ContentCardLinkBadge) => (
								<li
									key={`${uniqueId}-badge-${label}`}
									className={s.badgeListItem}
								>
									<Tooltip label={label}>
										<Badge ariaLabel={label} icon={icon} size="small" />
									</Tooltip>
								</li>
							))}
						</ul>
					) : null}
					<div className={s.icon}>
						<IconArrowRight24 />
					</div>
				</div>
			</div>
		</CardLink>
	)
}

export default TutorialsLandingContentCardLink
