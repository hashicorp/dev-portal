import { useId } from '@react-aria/utils'
import classNames from 'classnames'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import Badge from 'components/badge'
import CardLink from 'components/card-link'
import Tooltip from 'components/tooltip'
import {
	type ContentCardLinkBadge,
	type ContentCardLinkEyebrowPart,
	type ContentCardLinkProps,
} from '../types'
import s from './tutorials-landing-content-card-link.module.css'

const TutorialsLandingContentCardLink = ({
	backgroundImageUrl,
	backgroundImageColor = 'light',
	badges,
	description,
	eyebrowParts,
	headerImageUrl,
	href,
	title,
}: ContentCardLinkProps) => {
	const uniqueId = useId()
	const hasHeaderImage = headerImageUrl?.length > 0
	const hasBackgroundImage = backgroundImageUrl?.length > 0
	const hasLightBackgroundImage =
		hasBackgroundImage && backgroundImageColor === 'light'
	const hasDarkBackgroundImage =
		hasBackgroundImage && backgroundImageColor === 'dark'

	return (
		<CardLink ariaLabel={title} className={s.root} href={href}>
			{hasHeaderImage ? (
				<div
					className={s.headerImage}
					style={{
						backgroundImage: `url(${headerImageUrl})`,
					}}
				/>
			) : null}
			<div
				className={classNames(s.content, {
					[s.hasHeaderImage]: hasHeaderImage,
					[s.hasBackgroundImage]: hasBackgroundImage,
					[s.hasLightBackgroundImage]: hasLightBackgroundImage,
					[s.hasDarkBackgroundImage]: hasDarkBackgroundImage,
				})}
				style={
					hasBackgroundImage
						? {
								backgroundImage: `url(${backgroundImageUrl})`,
						  }
						: null
				}
			>
				<div className={s.text}>
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
										<Badge ariaLabel={label} icon={icon} size="medium" />
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
