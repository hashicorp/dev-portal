import { Badge } from '@hashicorp/react-mds/src/components/badge'
import * as CardPrimitives from '../primitives'
import type { CardProps } from '../types'

interface UnifiedCardProps extends CardProps {
	badges?: (string | string[])[]
}

const UnifiedCard = ({
	heading,
	meta,
	link,
	productBadges,
	badges,
	thumbnail,
	withArrow = false,
	isExternal = false,
	className,
	'aria-label': ariaLabel,
}: UnifiedCardProps) => {
	return (
		<CardPrimitives.Card
			link={link}
			withArrow={withArrow}
			isExternal={isExternal}
			className={className}
			aria-label={ariaLabel || heading}
		>
			{thumbnail ? <CardPrimitives.Thumbnail {...thumbnail} /> : null}
			<CardPrimitives.Content>
				{meta && meta.length > 0 ? <CardPrimitives.Meta items={meta} /> : null}
				<CardPrimitives.Heading>{heading}</CardPrimitives.Heading>
				{productBadges && productBadges?.length > 0 ? (
					<CardPrimitives.ProductBadges badges={productBadges}>
						{badges && badges.length > 0
							? badges.map((badge, stableIdx) => {
									if (Array.isArray(badge)) {
										return (
											<Badge key={stableIdx} icon={badge[0]} text={badge[1]} />
										)
									}

									return <Badge key={stableIdx} text={badge} />
							  })
							: null}
					</CardPrimitives.ProductBadges>
				) : null}
			</CardPrimitives.Content>
		</CardPrimitives.Card>
	)
}

export type { UnifiedCardProps }
export { UnifiedCard }
