import { GetStaticPropsContext } from 'next'
import {
	getCollection,
	getCollectionsBySection,
} from 'lib/learn-client/api/collection'
import { Collection as ApiCollection } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import { buildCategorizedWafSidebar } from 'views/well-architected-framework/utils/generate-sidebar-items'
import WellArchitectedFrameworkCollectionView from 'views/well-architected-framework/collection-view'
import { WellArchitectedFrameworkCollectionViewProps } from 'views/well-architected-framework/types'
import wafContent from 'content/well-architected-framework/index.json'
import wafData from 'data/well-architected-framework.json'

/**
 * - make a view file
 * - keep the prop gen logic in here
 * - build the sidebar data & layoutdata in the server
 * - add props
 * - double check design
 * - add comments / cleanup
 */

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ collectionSlug: string }>): Promise<{
	props: WellArchitectedFrameworkCollectionViewProps
}> {
	const { collectionSlug } = params
	const allWafCollections = await getCollectionsBySection(wafData.slug)
	const sidebarSections = buildCategorizedWafSidebar(
		allWafCollections,
		wafContent.sidebarCategories,
		collectionSlug
	)
	// TODO check data to see if I can use the collection from sidebar sections data
	const collectionData = await getCollection(
		`${wafData.slug}/${collectionSlug}`
	)
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: wafData.name, url: `/${wafData.slug}` },
		{
			title: collectionData.name,
			url: `/${collectionData.slug}`,
			isCurrentPage: true,
		},
	]

	return {
		props: stripUndefinedProperties({
			metadata: { wafName: wafData.name, wafSlug: wafData.slug },
			collection: collectionData,
			layoutProps: {
				sidebarSections,
				breadcrumbLinks,
			},
		}),
	}
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(wafData.slug)
	const paths = allCollections.map((c: ApiCollection) => ({
		params: { collectionSlug: splitProductFromFilename(c.slug) },
	}))

	return { paths, fallback: false }
}

export default WellArchitectedFrameworkCollectionView
