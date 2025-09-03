import type { ThumbnailProps } from '../types'
import { UnifiedCard } from '../unified-card'
import s from './style.module.css'

interface NewsroomCardProps {
	heading: string
	date: string
	category: string
	link: string
	thumbnail?: ThumbnailProps
	withArrow?: boolean
}

const NewsroomCard = ({
	heading,
	date,
	category,
	link,
	thumbnail,
	withArrow = false,
}: NewsroomCardProps) => {
	return (
		<UnifiedCard
			heading={heading}
			meta={[date, category]}
			link={link}
			thumbnail={thumbnail}
			withArrow={withArrow}
			className={s.newsroomCard}
		/>
	)
}

export type { NewsroomCardProps }
export { NewsroomCard }
