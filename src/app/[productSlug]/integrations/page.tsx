/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ProductIntegrationsLanding from 'views/product-integrations-landing'
import {
	getStaticPaths,
	getStaticProps,
} from 'views/product-integrations-landing/server'

export { getStaticPaths }

export default async function ({ params }) {
	const { props } = await getStaticProps({ params })
	return <ProductIntegrationsLanding {...props} />
}
