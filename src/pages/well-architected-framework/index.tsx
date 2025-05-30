/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getStaticProps } from 'views/product-root-docs-path-landing/server'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'

// Pre-configured getStaticProps for well-architected-framework/docs
const getStaticPropsWrapped = async (context) => {
	return getStaticProps({
		...context,
		params: {
			productSlug: 'well-architected-framework',
			rootDocsPath: ''
		}
	})
}

export { getStaticPropsWrapped as getStaticProps }
export default ProductRootDocsPathLanding 