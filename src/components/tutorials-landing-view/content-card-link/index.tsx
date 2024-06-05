/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import Badge from 'components/badge'
import CardLink from 'components/card-link'
import { ToastColor, developmentToast } from 'components/toast'
import Tooltip from 'components/tooltip'
import {
	type ContentCardLinkBadge,
	type ContentCardLinkEyebrowPart,
	type ContentCardLinkProps,
} from '../types'
import s from './tutorials-landing-content-card-link.module.css'

const ContentCardLink = ({
	backgroundImageColor = 'light',
	backgroundImageUrl,
	badges,
	description,
	eyebrowParts,
	headerImageUrl,
	href,
	onClick,
	title,
}: ContentCardLinkProps) => {
	const hasHeaderImage = headerImageUrl?.length > 0
	const hasBackgroundImage = backgroundImageUrl?.length > 0
	const hasLightBackgroundImage =
		hasBackgroundImage && backgroundImageColor === 'light'
	const hasDarkBackgroundImage =
		hasBackgroundImage && backgroundImageColor === 'dark'

	if (hasHeaderImage && hasBackgroundImage) {
		developmentToast({
			color: ToastColor.critical,
			title: 'Error in `ContentCardLink`',
			description:
				'`ContentCardLink` does not accept both `headerImageUrl` and `backgroundImageUrl`. Only provide one.',
		})
	}

	return (
		<CardLink
			ariaLabel={title}
			className={s.root}
			href={href}
			onClick={onClick}
		>
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
							{eyebrowParts.map((eyebrowPart: ContentCardLinkEyebrowPart) => (
								<span className={s.eyebrowPart} key={eyebrowPart}>
									{eyebrowPart}
								</span>
							))}
						</div>
					) : null}
					<h3 className={s.title}>{title}</h3>
					<p className={s.description}>{description}</p>
				</div>
				<div className={s.footer}>
					{badges?.length > 0 ? (
						<ul className={s.badgeList}>
							{badges.map(({ icon, label }: ContentCardLinkBadge) => (
								<li key={label} className={s.badgeListItem}>
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

export default ContentCardLink
