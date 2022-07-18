import BaseNewLayout from 'layouts/base-new'
import getProductPageContent from 'views/product-tutorials-view/helpers/get-product-page-content'
import Heading from 'components/heading'
import ProductViewContent from 'views/product-tutorials-view/components/product-view-content'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'

const WAF_SLUG = 'well-architected-framework'

// TODO - figure out betta API solution to serve sidebar data
// right now its fetching ALL collections and filtering based on the slug
export default function WellArchitectedFrameworkLanding(props) {
	const { pageData, inlineCollections, inlineTutorials, allTopicCollections } =
		props.content
	return (
		<>
			=
			<Heading level={1} size={500} weight="bold">
				{pageData.title}
			</Heading>
			<ProductViewContent
				blocks={pageData.blocks}
				inlineCollections={inlineCollections}
				inlineTutorials={inlineTutorials}
			/>
			<Heading level={1} size={500} weight="bold">
				All Collections
			</Heading>
			<ul>
				{allTopicCollections.map((collection) => (
					<li key={collection.id}>
						<a href={`topics/${collection.slug}`}>{collection.name}</a>
					</li>
				))}
			</ul>
		</>
	)
}

async function _tempGetCollectionsForDir(dir: string) {
	const allCollections = await getAllCollections() // need a specific way to call waf content
	// filter for waf specific collections, order alphabetically and add to sidebar
	return allCollections.filter((c) => c.slug.startsWith(dir))
}

export async function getStaticProps() {
	const pageContent = await getProductPageContent(WAF_SLUG)
	const wafCollections = await _tempGetCollectionsForDir(WAF_SLUG)

	return {
		props: stripUndefinedProperties({
			content: { ...pageContent, allTopicCollections: wafCollections },
		}),
	}
}

WellArchitectedFrameworkLanding.layout = BaseNewLayout
