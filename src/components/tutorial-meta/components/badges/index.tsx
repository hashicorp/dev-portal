import { Product as ClientProduct } from 'lib/learn-client/types'
import { TutorialData } from 'views/tutorial-view'
import { renderProductBadges, ProductDisplayOption } from './components/badge'
import getReadableTime, { generateBadges } from './helpers'
import s from './badges.module.css'

export interface BadgesProps {
	options: BadgeOptions
}
export interface BadgeOptions
	extends Pick<TutorialData, 'readTime' | 'edition'> {
	products: Pick<ClientProduct, 'name' | 'slug'>[]
	isBeta: boolean
	hasVideo: boolean
	isInteractive: boolean
}

export function Badges({ options }: BadgesProps): React.ReactElement {
	const { readTime, products, edition, isBeta, hasVideo, isInteractive } =
		options
	const [badgeDisplayOptions, Badge] = generateBadges(
		readTime,
		products,
		edition
	)
	const showEditionBadge = edition !== 'open_source' // Edu team wants to hide the open source badge
	const productBadgeOptions =
		badgeDisplayOptions.products as ProductDisplayOption[]
	const showProductBadges =
		Array.isArray(productBadgeOptions) && productBadgeOptions.length > 0

	return (
		<ul className={s.list}>
			<p className={s.readTime}>{getReadableTime(readTime)}</p>
			{isBeta ? <Badge className={s.beta} type="isBeta" /> : null}
			{showEditionBadge ? <Badge type="edition" /> : null}
			{showProductBadges ? renderProductBadges(productBadgeOptions) : null}
			{hasVideo ? <Badge type="hasVideo" /> : null}
			{isInteractive ? <Badge type="isInteractive" /> : null}
		</ul>
	)
}
