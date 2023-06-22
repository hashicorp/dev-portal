/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import BadgeList from 'components/badge-list'
import Button from 'components/button'
import Card from 'components/card'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import IconTileLogo from 'components/icon-tile-logo'
import StandaloneLink from 'components/standalone-link'
import Text from 'components/text'
import s from './content-header-card.module.css'
import {
	ButtonListProps,
	ContentHeaderCardProps,
	DropdownItem,
	Button as HeaderCardButton,
	Link,
	VersionDropdownProps,
} from './types'

export default function ContentHeaderCard({
	className,
	icon,
	title,
	attribution,
	description,
	note,
	badges,
	dropdown,
	links,
	buttons,
}: ContentHeaderCardProps) {
	const hasLinks = links && links.length > 0
	const hasButtons = buttons && buttons.length > 0
	return (
		<Card
			elevation="base"
			className={classNames(s.contentHeaderCard, className)}
		>
			<div className={s.cardTop}>
				{icon && (
					<IconTileLogo className={s.icon} size="large" productSlug={icon} />
				)}
				<div className={s.content}>
					<div className={s.upper}>
						{dropdown && (
							<VersionDropdown
								className={'g-hide-on-desktop g-hide-on-tablet'}
								dropdown={dropdown}
							/>
						)}
						<div className={s.left}>
							<div className={s.titleWrap}>
								<span className={s.title}>{title}</span>
								{attribution && (
									<Text size={100} weight="medium" className={s.attribution}>
										{attribution}
									</Text>
								)}
							</div>
							{description && (
								<Text size={200} className={s.description}>
									{description}
								</Text>
							)}
						</div>
						{dropdown && (
							<VersionDropdown
								className={'g-hide-on-mobile'}
								dropdown={dropdown}
							/>
						)}
					</div>
					{(note || badges) && (
						<div className={s.lower}>
							{badges && (
								<BadgeList
									className={s.badgeList}
									size="small"
									badges={badges}
								/>
							)}
							{note && (
								<Text size={200} className={s.note}>
									{note}
								</Text>
							)}
						</div>
					)}
				</div>
			</div>
			{(hasLinks || hasButtons) && (
				<div className={s.cardBottom}>
					{hasLinks && (
						<ul className={s.linksList}>
							{links.map((link: Link) => {
								return (
									<li key={link.text} className={s.link}>
										<StandaloneLink
											text={link.text}
											icon={link.icon}
											href={link.href}
											opensInNewTab={!link.href.startsWith('/')}
											iconPosition="leading"
											color="secondary"
										/>
									</li>
								)
							})}
						</ul>
					)}
					{hasButtons && (
						<>
							{/* Rendering two button lists here to avoid flex-reverse
							to ensure dom ordering matches the visual order for a11y.
							We need the buttons to display in reverse when the button list
							is floating to the right.

							We accomplish this by conditionally displaying the right ordered
							button list via CSS.
							*/}
							<ButtonList
								buttons={buttons}
								hasLinks={hasLinks}
								isReversed={false}
							/>
							<ButtonList
								buttons={buttons}
								hasLinks={hasLinks}
								isReversed={true}
							/>
						</>
					)}
				</div>
			)}
		</Card>
	)
}

function VersionDropdown({ dropdown, className }: VersionDropdownProps) {
	return (
		<DropdownDisclosure
			className={classNames(s.dropdown, className)}
			listPosition="right"
			color="secondary"
			text={dropdown.text}
		>
			{dropdown.items.map((item: DropdownItem) => {
				return (
					<DropdownDisclosureLinkItem key={item.text} href={item.href}>
						{item.text}
					</DropdownDisclosureLinkItem>
				)
			})}
		</DropdownDisclosure>
	)
}

function ButtonList({ buttons, hasLinks, isReversed }: ButtonListProps) {
	let primaryIndex = 0
	if (isReversed) {
		buttons = buttons.reverse()
		primaryIndex = buttons.length - 1
	}
	return (
		<ul
			className={classNames(s.buttonsList, {
				[s.buttonsOnly]: !hasLinks,
				[s.reversed]: isReversed,
			})}
		>
			{buttons.map((button: HeaderCardButton, index: number) => {
				return (
					<li key={button.text}>
						<Button
							onClick={() => {
								button.onClick()
							}}
							text={button.text}
							color={
								button.isPrimary && index === primaryIndex
									? 'primary'
									: 'secondary'
							}
							icon={button.icon}
							iconPosition="leading"
							size="small"
						/>
					</li>
				)
			})}
		</ul>
	)
}
