import BaseNewLayout from 'layouts/base-new'
import getProductPageContent from 'views/product-tutorials-view/helpers/get-product-page-content'
import Heading from 'components/heading'
import ProductViewContent from 'views/product-tutorials-view/components/product-view-content'

// TODO - figure out sidebar gen
export default function WellArchitectedFrameworkLanding(props) {
	console.log({ props })
	const { pageData, inlineCollections, inlineTutorials } = props
	const { title, blocks } = pageData
	return (
		<>
			<Heading level={1} size={500} weight="bold">
				{title}
			</Heading>
			<ProductViewContent
				blocks={blocks}
				inlineCollections={inlineCollections}
				inlineTutorials={inlineTutorials}
			/>
		</>
	)
}

export async function getStaticProps() {
	const pageContent = await getProductPageContent('well-architected-framework')
	return { props: { yo: 'hi', ...pageContent } }
}

WellArchitectedFrameworkLanding.layout = BaseNewLayout
