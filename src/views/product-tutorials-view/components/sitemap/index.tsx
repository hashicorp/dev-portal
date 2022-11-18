import classNames from 'classnames'
import { IconCollections24 } from '@hashicorp/flight-icons/svg-react/collections-24'
import {
	Collection as ClientCollection,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import {
	getCollectionSlug,
	getTutorialSlug,
} from 'views/collection-view/helpers'
import { getSitemapHeading } from 'views/product-tutorials-view/helpers/heading-helpers'
import Heading from 'components/heading'
import IconTile from 'components/icon-tile'
import Link from 'components/link'
import { ProductTutorialsSitemapProps } from './types'
import s from './sitemap.module.css'

export function ProductTutorialsSitemap({
	collections,
	product,
}: ProductTutorialsSitemapProps): React.ReactElement {
	const { title, level, slug } = getSitemapHeading()

	return (
		<div className={s.root}>
			<div className={s.headingBar}>
				<Heading
					id={slug}
					size={300}
					level={level}
					weight="bold"
					className={s.heading}
				>
					{title}
				</Heading>
			</div>
			<ul className={s.collectionListRoot}>
				{collections.map((collection: ClientCollection) => (
					<li key={collection.id} className={s.collectionListItem}>
						<div className={s.collectionLinkSizer}>
							<Link
								className={s.collectionLink}
								href={getCollectionSlug(collection.slug)}
							>
								<span className={s.collectionLinkIcon}>
									<IconTile size="small" brandColor={product}>
										<IconCollections24 />
									</IconTile>
								</span>
								<span>{collection.name}</span>
							</Link>
						</div>
						<ul
							className={classNames(s.tutorialListRoot, {
								[s.hasMultipleItems]: collection.tutorials.length > 1,
							})}
						>
							{collection.tutorials.map((t: ClientTutorialLite) => (
								<li key={t.id} className={s.tutorialListItem}>
									<Link
										className={s.tutorialLink}
										href={getTutorialSlug(t.slug, collection.slug)}
									>
										{t.name}
									</Link>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</div>
	)
}
