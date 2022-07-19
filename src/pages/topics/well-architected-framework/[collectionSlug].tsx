import { getCollection } from 'lib/learn-client/api/collection'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import CollectionMeta from 'views/collection-view/components/collection-meta'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import CollectionTutorialList from 'views/collection-view/components/collection-tutorial-list'
import {
	WAF_SLUG,
	_tempGetCollectionsForDir,
	_tempCollectionSidebarPlaceholder,
} from '.'
import BaseNewLayout from 'layouts/base-new'

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
					url: `/topics/${slug}/${splitProductFromFilename(t.slug)}`,
					productsUsed: t.productsUsed.map((p) => p.product.slug),
				}))}
			/>
			<_tempCollectionSidebarPlaceholder collections={sidebarCollections} />
		</>
	)
}

export async function getStaticProps({ params }) {
	const { collectionSlug } = params
	const sidebarCollections = await _tempGetCollectionsForDir(WAF_SLUG)
	const collectionData = await getCollection(`${WAF_SLUG}/${collectionSlug}`)

	return {
		props: stripUndefinedProperties({
			content: { sidebarCollections, ...collectionData },
		}),
	}
}

export async function getStaticPaths() {
	const allCollections = await _tempGetCollectionsForDir(WAF_SLUG)
	const paths = allCollections.map((c) => ({
		params: { collectionSlug: splitProductFromFilename(c.slug) },
	}))

	return { paths, fallback: false }
}

TopicsCollectionPage.layout = BaseNewLayout
