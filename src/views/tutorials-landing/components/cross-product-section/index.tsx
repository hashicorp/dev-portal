import CollectionContentCardLink from 'components/tutorials-landing-view/collection-content-card-link'
import s from './cross-product-section.module.css'
import classNames from 'classnames'
import { Collection } from 'lib/learn-client/types'

interface CrossProductSectionProps {
	className?: string
	collections: Collection[]
	title: string
}

const CrossProductSection = ({
	className,
	collections,
	title,
}: CrossProductSectionProps) => {
	return (
		<section className={classNames(s.root, className)}>
			<h2 className={s.title}>{title}</h2>
			<ul className={s.list}>
				{collections.map((collection: Collection) => {
					return (
						<li className={s.listItem} key={collection.slug}>
							<CollectionContentCardLink
								collection={collection}
								hideBadges
								hideImages
							/>
						</li>
					)
				})}
			</ul>
		</section>
	)
}

export { CrossProductSection }
