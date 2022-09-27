import Link from 'next/link'
import Badge, { BadgeProps } from 'components/badge'
import Text from 'components/text'
import { developmentToast, ToastColor } from 'components/toast'
import {
	CommandBarButtonListItemProps,
	CommandBarLinkListItemProps,
	CommandBarListItemContentProps,
	CommandBarListItemProps,
} from './types'
import s from './command-bar-list-item.module.css'

const CommandBarListItem = ({ children }: CommandBarListItemProps) => {
	return <li className={s.listItem}>{children}</li>
}

const CommandBarListItemContent = ({
	badges,
	description,
	icon,
	title,
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
			<div className={s.textWrapper}>
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
		</>
	)
}

const CommandBarButtonListItem = ({
	badges,
	description,
	icon,
	title,
	onClick,
}: CommandBarButtonListItemProps) => {
	return (
		<CommandBarListItem>
			<button className={s.linkOrButton} onClick={onClick} tabIndex={-1}>
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
	return (
		<CommandBarListItem>
			<Link href={url}>
				<a className={s.linkOrButton} tabIndex={-1}>
					<CommandBarListItemContent
						badges={badges}
						description={description}
						icon={icon}
						title={title}
					/>
				</a>
			</Link>
		</CommandBarListItem>
	)
}

export type { CommandBarLinkListItemProps, CommandBarButtonListItemProps }
export { CommandBarButtonListItem, CommandBarLinkListItem }
