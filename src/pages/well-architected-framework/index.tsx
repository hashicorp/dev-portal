import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { buildLayoutHeadings } from 'views/product-tutorials-view/helpers/heading-helpers'
import getProductPageContent from 'views/product-tutorials-view/helpers/get-product-page-content'
import ProductViewContent from 'views/product-tutorials-view/components/product-view-content'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import processPageData from 'views/product-tutorials-view/helpers/process-page-data'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import { SidebarProps } from 'components/sidebar'
import { PageSlugOption } from 'lib/learn-client/api/page'
import { sortAlphabetically } from 'views/product-tutorials-view/helpers'
import { Collection as ApiCollection } from 'lib/learn-client/types'

/**
 * TODO: figure out where this data should live. Potentially in the /content folder
 *
 * Problem: we don't have a way to generate these sidebar categories currently
 * via the tutorials repo data. We could add these to the generic waf page data, or create a new
 * data file in dev dot to store this data for now.
 */
export const wafData = {
	slug: 'well-architected-framework',
	name: 'Well Architected Framework',
	sidebarCategories: [
		{
			name: 'Framework Pillars',
			collections: [
				'well-architected-framework/operational-excellence',
				'well-architected-framework/reliability',
			],
		},
		{
			name: 'Reference Architecture',
			collections: [
				'well-architected-framework/nomad',
				'well-architected-framework/terraform',
				'well-architected-framework/zero-trust-networking',
				'well-architected-framework/zero-trust-security',
			],
		},
	],
}

const wafLandingPageData = {
	hero: {
		heading: 'Well Architected Framework',
		image: 'https://place-hold.it/600x320',
	},
	overview: {
		heading: 'What is Well Architected Framework?',
		body: "HashiCorp's well architected framework provides best practice guidance for organizations. Specifically, it aims to help practitioners optimize their production HashiCorp deployments while also meeting their organization's specific architectural needs. The well architected framework starts at the cloud operating model, it sets the overarching goal of the framework, cloud migration enablement.",
		cta: {
			text: 'Learn more about Well Architected Framework',
			url: '/vault/docs/what-is-vault',
		},
		image: 'https://place-hold.it/680x250',
	},
}

/**
 * The sidebar consists first of a list of uncategorized collections, sorted
 * alphabetically. Then follows with the categorized collections defined
 * in the `sidebarCategories` data above.
 */
function generateWafSidebarData(sidebarSections: ApiCollection[]) {
	const uncategorizedItems = new Map(
		sidebarSections
			.sort(sortAlphabetically('name'))
			.map((collection) => [
				collection.slug,
				{ title: collection.name, fullPath: collection.slug, isActive: false },
			])
	)
	const categorizedItems = []

	// go into the categories, build a section
	wafData.sidebarCategories.map((category) => {
		const items = category.collections
			.map((collectionSlug) => {
				const item = sidebarSections.find(
					(section) => section.slug === collectionSlug
				)
				// if it exists in the category, remove it from 'uncategorized'list
				if (item) {
					uncategorizedItems.delete(collectionSlug)
				}
				return item
			})
			.sort(sortAlphabetically('name'))
		categorizedItems.push(
			{ divider: true },
			{ heading: category.name },
			...items.map((item) => ({
				title: item.name,
				isActive: false,
				fullPath: item.slug,
			}))
		)
	})

	return {
		title: wafData.name,
		levelButtonProps: {
			levelUpButtonText: 'Main Menu',
			levelDownButtonText: 'Previous',
		},
		menuItems: [
			{ title: 'Overview', isActive: true, fullPath: `/${wafData.slug}` },
			...Array.from(uncategorizedItems.values()),
			...categorizedItems,
		],
		showFilterInput: false,
	}
}

// @TODO - add the heading 'callout' and the description section with picture...
export default function WellArchitectedFrameworkLanding(props) {
	const { data, layoutProps } = props
	const { pageData, inlineCollections, inlineTutorials } = data
	console.log({ props })

	return (
		<SidebarSidecarLayout
			headings={layoutProps.headings}
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(wafData.name) as SidebarProps,
				generateWafSidebarData(layoutProps.sidebarSections),
			]}
		>
			{/** @TODO - swap this placeholder data with
			 * the hero and overview components
			 */}
			<h1>{wafLandingPageData.hero.heading}</h1>
			<div>
				<h3>What is the Well Architected Framework?</h3>
				<p>{pageData.description}</p>
			</div>
			<ProductViewContent
				blocks={pageData.blocks}
				inlineCollections={inlineCollections}
				inlineTutorials={inlineTutorials}
			/>
		</SidebarSidecarLayout>
	)
}

export async function getStaticProps() {
	const {
		pageData: rawPageData,
		inlineCollections,
		inlineTutorials,
	} = await getProductPageContent(wafData.slug as PageSlugOption)
	const { pageData } = await processPageData(rawPageData)
	const wafCollections = await getCollectionsBySection(wafData.slug)
	const layoutProps = {
		headings: buildLayoutHeadings(pageData),
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: { name: wafData.name, filename: wafData.slug },
		}),
		sidebarSections: wafCollections,
	}

	return {
		props: stripUndefinedProperties({
			metadata: {
				title: 'Tutorials',
			},
			data: {
				pageData,
				inlineCollections,
				inlineTutorials,
			},
			layoutProps,
		}),
	}
}
