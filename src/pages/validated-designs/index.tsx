/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getStaticProps } from 'views/product-root-docs-path-landing/server'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'

// Pre-configured getStaticProps for validated-designs/docs
const getStaticPropsWrapped = async (context) => {
	return getStaticProps({
		...context,
		params: {
			productSlug: 'validated-designs',
			rootDocsPath: ''
		}
	})
}

export { getStaticPropsWrapped as getStaticProps }
export default ProductRootDocsPathLanding
