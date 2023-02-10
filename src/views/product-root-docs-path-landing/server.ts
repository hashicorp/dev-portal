import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { GetStaticPropsContext } from 'next'
import { ProductSlug, RootDocsPath } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { getStaticGenerationFunctions } from 'views/docs-view/server'

const getStaticProps = async (context: GetStaticPropsContext) => {
	// Constants
	const basePath = 'docs'

	// Fetch product data
	const productSlug = context.params.productSlug as string
	const product = cachedGetProductData(productSlug as ProductSlug)

	// Pull properties from product data
	const currentRootDocsPath = product.rootDocsPaths.find(
		(rootDocsPath: RootDocsPath) => rootDocsPath.path === basePath
	)
	const {
		name,
		productSlugForLoader = product.slug,
		shortName,
	} = currentRootDocsPath
	const baseName = shortName || name

	// Fetch page content
	const jsonFilePath = path.join(
		process.cwd(),
		`src/content/${product.slug}/docs-landing.json`
	)
	const pageContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))

	// Generate getStaticProps from DocsView helper
	const { getStaticProps: generatedGetStaticProps } =
		getStaticGenerationFunctions({
			product,
			productSlugForLoader,
			basePath,
			baseName,
		})

	// TODO: replace any with accurate type
	const generatedProps = (await generatedGetStaticProps({
		...context,
		params: { page: [] },
	})) as $TSFixMe

	const pageTitle = `${product.name} Documentation`
	return {
		...generatedProps,
		props: {
			...generatedProps.props,
			layoutProps: {
				...generatedProps.props.layoutProps,
				githubFileUrl: null,
			},
			pageContent,
			pageHeading: {
				title: pageTitle,
				id: slugify(pageTitle, { lower: true }),
			},
			product: {
				...generatedProps.props.product,
				currentRootDocsPath,
			},
		},
	}
}

export { getStaticProps }
