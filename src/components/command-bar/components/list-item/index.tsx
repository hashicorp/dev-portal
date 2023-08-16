/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement, PropsWithChildren } from 'react'
import classNames from 'classnames'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Badge, { BadgeProps } from 'components/badge'
import Link from 'components/link'
import Text from 'components/text'
import { developmentToast, ToastColor } from 'components/toast'
import s from './command-bar-list-item.module.css'

const CommandBarListItem = ({ children }: PropsWithChildren) => {
	return <li className={s.listItem}>{children}</li>
}

interface CommandBarListItemContentProps {
	badges?: BadgeProps['text'][]
	description?: string
	icon?: ReactElement
	title: string
	trailingIcon?: ReactElement
}

const CommandBarListItemContent = ({
	badges,
	description,
	icon,
	title,
	trailingIcon,
}: CommandBarListItemContentProps) => {
	const hasIcon = !!icon
	const hasBadges = badges && badges.length > 0
	const hasDescription = !!description

	/**
	 * @TODO the CSS for handling an icon alongside ellipsing long titles and
	 * descriptions is not straightforward. We do not currently need an icon when
	 * there is a description shown, so have added this development toast for the
	 * short term to save time.
	 */
	if (hasIcon && hasDescription) {
		developmentToast({
			title: 'Warning in CommandBarLinkListItem',
			description:
				'CommandBarLinkListItem does not yet support both icon and a description.',
			autoDismiss: false,
			color: ToastColor.critical,
		})
	}

	return (
		<>
			{hasIcon ? <span className={s.icon}>{icon}</span> : null}
			<div
				className={classNames(
					s.textWrapper,
					!!trailingIcon && s.hasTrailingIcon
				)}
			>
				<div className={s.titleAndBadgeWrapper}>
					<Text
						dangerouslySetInnerHTML={{ __html: title }}
						asElement="span"
						className={s.title}
						size={200}
						weight="medium"
					/>
					{hasBadges
						? badges.map((badgeText: BadgeProps['text'], index: number) => (
								<Badge
									// eslint-disable-next-line react/no-array-index-key
									key={index}
									color="neutral"
									className={s.productBadge}
									size="small"
									text={badgeText}
									type="outlined"
								/>
						  ))
						: null}
				</div>
				{hasDescription ? (
					<Text
						dangerouslySetInnerHTML={{ __html: description }}
						asElement="span"
						className={s.description}
						size={100}
						weight="regular"
					/>
				) : null}
			</div>
			{trailingIcon ? (
				<span className={s.trailingIcon}>{trailingIcon}</span>
			) : null}
		</>
	)
}

interface CommandBarButtonListItemProps extends CommandBarListItemContentProps {
	onClick: () => void
}

const CommandBarButtonListItem = ({
	badges,
	description,
	icon,
	title,
	onClick,
	// @ts-expect-error - TODO(kevinwang) expose className prop
	className,
}: CommandBarButtonListItemProps) => {
	return (
		<CommandBarListItem>
			<button
				className={classNames(s.linkOrButton, className)}
				onClick={onClick}
			>
				<CommandBarListItemContent
					badges={badges}
					description={description}
					icon={icon}
					title={title}
				/>
			</button>
		</CommandBarListItem>
	)
}

interface CommandBarLinkListItemProps extends CommandBarListItemContentProps {
	url: string
}

/**
 * @TODO wrapping all of the content in an anchor element is likely not ideal.
 * Will need thorough screen reader testing once the feature comes together with
 * keyboard navigation implemented.
 */
const CommandBarLinkListItem = ({
	badges,
	description,
	icon,
	title,
	url,
}: CommandBarLinkListItemProps) => {
	const isExternal = !url.startsWith('/')
	return (
		<CommandBarListItem>
			<Link className={s.linkOrButton} href={url} opensInNewTab={isExternal}>
				<CommandBarListItemContent
					badges={badges}
					description={description}
					icon={icon}
					title={title}
					trailingIcon={isExternal ? <IconExternalLink16 /> : null}
				/>
			</Link>
		</CommandBarListItem>
	)
}

export { CommandBarButtonListItem, CommandBarLinkListItem }
