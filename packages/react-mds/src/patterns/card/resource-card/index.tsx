import type { CardProps, ThumbnailProps } from '../types'
import { UnifiedCard } from '../unified-card'

interface ResourceCardProps {
	heading: string
	date?: string
	category: string
	link: string
	productBadges?: CardProps['productBadges']
	thumbnail: ThumbnailProps
	isExternal?: CardProps['isExternal']
}

const ResourceCard = ({
	heading,
	date,
	category,
	link,
	productBadges,
	thumbnail,
	isExternal,
}: ResourceCardProps) => {
	const meta: string[] = date ? [date, category] : [category]

	return (
		<UnifiedCard
			link={link}
			meta={meta}
			productBadges={productBadges}
			thumbnail={thumbnail}
			isExternal={isExternal}
			heading={heading}
		/>
	)
}

export type { ResourceCardProps }
export { ResourceCard }
