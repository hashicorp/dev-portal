import Card from 'components/card'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import TruncateMaxLines from 'components/truncate-max-lines'
import { useDeviceSize } from 'contexts'
import { ProductSlug } from 'types/products'
import s from './content-header-card.module.css'

export interface ContentHeaderCardProps {
	icon?: Exclude<ProductSlug, 'sentinel'>
	title: string
	attribution?: string
	description?: string
}

export default function ContentHeaderCard({
	icon,
	title,
	attribution,
	description,
}: ContentHeaderCardProps) {
	const { isMobile } = useDeviceSize()

	return (
		<Card elevation="base" className={s.contentHeaderCard}>
			<div className={s.cardTop}>
				{icon && (
					<IconTileLogo className={s.icon} size="large" productSlug={icon} />
				)}
				<div className={s.left}>
					<div className={s.titleWrap}>
						<TruncateMaxLines
							maxLines={isMobile ? 2 : 1}
							lineHeight="var(--token-typography-body-300-line-height)"
						>
							<Heading size={300} weight="bold" level={1} className={s.title}>
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
				<div className={s.right}></div>
			</div>
			<div className={s.cardBottom}></div>
		</Card>
	)
}
