/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ProductIntegrationsLanding from 'views/product-integrations-landing'
import {
	getStaticPaths,
	getStaticProps,
} from 'views/product-integrations-landing/server'

const ProductIntegrationsLandingWithQueryParams = (props) => {
	return <ProductIntegrationsLanding {...props} hasQueryParams />
}

export { getStaticPaths, getStaticProps }
export default ProductIntegrationsLandingWithQueryParams
