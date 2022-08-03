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
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { SidebarProps } from 'components/sidebar'
import { buildCategorizedWafSidebar } from 'views/well-architected-framework/utils/generate-sidebar-items'
import wafContent from 'content/well-architected-framework/index.json'

/**
 * TODO
 * - get sidebar sidecar layout working
 * - layout props
 *      - headings
 *      - breadcrumb links
 *      - sidebar nav data levels (will be v similar to landing page)
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
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: wafData.name, url: `/${wafData.slug}` },
		{ title: name, url: `/${slug}` },
	]
	return (
		<SidebarSidecarLayout
			sidecarSlot={null}
			breadcrumbLinks={breadcrumbLinks}
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(wafData.name) as SidebarProps,
				{
					title: name,
					levelButtonProps: {
						levelUpButtonText: `Main Menu`,
						levelDownButtonText: 'Previous',
					},
					overviewItemHref: `/${slug}`,
					menuItems: buildCategorizedWafSidebar(
						sidebarCollections,
						wafContent.sidebarCategories
					),
					showFilterInput: false,
				},
			]}
		>
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
		</SidebarSidecarLayout>
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
