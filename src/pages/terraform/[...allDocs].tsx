import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'views/docs-view/utils/all-docs-server'
import DocsView from 'views/docs-view'

/**
 * TODO: does not work as expected with custom docs routes (I think?)
 * The combination of this page file (pages/terraform/[...allDocs].tsx)
 * with the custom /docs page file (pages/[productSlug]/docs/index.tsx)
 * does not seem to work as expected. I've seen some deploy previews
 * with the custom /docs page rendering; and others where the default
 * docs page is rendered instead.
 *
 * Need to investigate further, outside the scope of initial Terraform spike
 * work, as custom docs page work is on hold while we finalize our approach.
 */
const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	productData: terraformData as ProductData,
})

export { getStaticPaths, getStaticProps }
export default DocsView
