import classNames from 'classnames'
import BadgeList from 'components/badge-list'
import Button from 'components/button'
import Card from 'components/card'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import StandaloneLink from 'components/standalone-link'
import Text from 'components/text'
import s from './content-header-card.module.css'
import {
	ContentHeaderCardProps,
	DropdownItem,
	Button as HeaderCardButton,
	Link,
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
						<div className={s.left}>
							<div className={s.titleWrap}>
								<Heading size={300} weight="bold" level={1} className={s.title}>
									{title}
								</Heading>
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
							<DropdownDisclosure
								listPosition="right"
								className={s.dropdown}
								color="secondary"
								text={dropdown.text}
							>
								{dropdown.items.map((item: DropdownItem) => {
									return (
										<DropdownDisclosureLinkItem
											key={item.text}
											href={item.href}
										>
											{item.text}
										</DropdownDisclosureLinkItem>
									)
								})}
							</DropdownDisclosure>
						)}
					</div>
					{(note || badges) && (
						<div className={s.lower}>
							{badges && (
								<BadgeList
									className={s.badgeList}
									type="outlined"
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
										/>
									</li>
								)
							})}
						</ul>
					)}
					{hasButtons && (
						<ul
							className={classNames(s.buttonsList, {
								[s.buttonsOnly]: !hasLinks,
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
												button.isPrimary && index === 0
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
					)}
				</div>
			)}
		</Card>
	)
}
