import Link from 'next/link'
import {
	getCollection,
	getCollectionsBySection,
} from 'lib/learn-client/api/collection'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import CollectionMeta from 'views/collection-view/components/collection-meta'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import CollectionTutorialList from 'views/collection-view/components/collection-tutorial-list'
import Heading from 'components/heading'
import wafData from 'data/well-architected-framework.json'
import BaseNewLayout from 'layouts/base-new'

/**
 * TODO
 * - get sidebar sidecar layout working
 */
export default function TopicsCollectionPage(props) {
	const {
		name,
		id,
		description,
		tutorials,
		ordered,
		slug,
		sidebarCollections,
	} = props.content
	return (
		<>
			<CollectionMeta
				heading={{ text: name, id }}
				description={description}
				cta={{ href: tutorials[0].slug }}
				numTutorials={tutorials.length}
			/>
			<CollectionTutorialList
				isOrdered={ordered}
				tutorials={tutorials.map((t: ClientTutorialLite) => ({
					id: t.id,
					description: t.description,
					duration: getReadableTime(t.readTime),
					hasInteractiveLab: Boolean(t.handsOnLab),
					hasVideo: Boolean(t.video),
					heading: t.name,
					url: `/${slug}/${splitProductFromFilename(t.slug)}`,
					productsUsed: t.productsUsed.map((p) => p.product.slug),
				}))}
			/>
		</>
	)
}

export function _tempCollectionSidebarPlaceholder({ collections }) {
	return (
		<>
			<Heading level={1} size={500} weight="bold">
				All Collections
			</Heading>
			<ul>
				{collections.map((collection) => (
					<li key={collection.id}>
						<Link href={`/${collection.slug}`}>
							<a>{collection.name}</a>
						</Link>
					</li>
				))}
			</ul>
		</>
	)
}

export async function getStaticProps({ params }) {
	const { collectionSlug } = params
	// TODO use the function from the landing page
	const sidebarCollections = await getCollectionsBySection(wafData.slug)
	// TODO find the collection based on the slug in the `sidebarCollections` list
	const collectionData = await getCollection(
		`${wafData.slug}/${collectionSlug}`
	)

	return {
		props: stripUndefinedProperties({
			content: { sidebarCollections, ...collectionData },
		}),
	}
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(wafData.slug)
	const paths = allCollections.map((c) => ({
		params: { collectionSlug: splitProductFromFilename(c.slug) },
	}))

	return { paths, fallback: false }
}

TopicsCollectionPage.layout = BaseNewLayout
