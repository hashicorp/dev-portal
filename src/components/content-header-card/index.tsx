import Card from 'components/card'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import TruncateMaxLines from 'components/truncate-max-lines'
import { useDeviceSize } from 'contexts'
import { ProductSlug } from 'types/products'
import s from './content-header-card.module.css'
import BadgeList, { Badge } from 'components/badge-list'

export interface ContentHeaderCardProps {
	icon?: Exclude<ProductSlug, 'sentinel'>
	title: string
	attribution?: string
	description?: string
	note?: string
	badges?: Array<Badge>
}

export default function ContentHeaderCard({
	icon,
	title,
	attribution,
	description,
	note,
	badges,
}: ContentHeaderCardProps) {
	const { isMobile } = useDeviceSize()

	return (
		<Card elevation="base" className={s.contentHeaderCard}>
			<div className={s.cardTop}>
				{icon && (
					<IconTileLogo className={s.icon} size="large" productSlug={icon} />
				)}
				<div className={s.content}>
					<div className={s.upper}>
						<div className={s.left}>
							<div className={s.titleWrap}>
								<TruncateMaxLines
									maxLines={isMobile ? 2 : 1}
									lineHeight="var(--token-typography-body-300-line-height)"
								>
									<Heading
										size={300}
										weight="bold"
										level={1}
										className={s.title}
									>
										{title}
									</Heading>
								</TruncateMaxLines>
								{attribution && (
									<Text size={100} weight="medium" className={s.attribution}>
										{attribution}
									</Text>
								)}
							</div>
							{description && (
								<TruncateMaxLines
									maxLines={2}
									lineHeight="var(--token-typography-body-200-line-height)"
								>
									<Text size={200} className={s.description}>
										{description}
									</Text>
								</TruncateMaxLines>
							)}
						</div>
						<div className={s.right}>{/* TODO: add dropdown here */}</div>
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
			<div className={s.cardBottom}>
				{/* TODO: Add Links here */}
				{/* TODO: Add Buttons here */}
			</div>
		</Card>
	)
}
