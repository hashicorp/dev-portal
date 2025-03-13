/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import ErrorViewSwitcher from 'views/error-view-switcher'
// product data, needed to render top navigation
import { productConfig } from 'lib/cms'
import { isProductSlug } from 'lib/products'
import PropTypes from 'prop-types'

function Error({ statusCode }) {
	const Layout = (props) => (
		<BaseLayout {...props} mobileMenuSlot={<MobileMenuLevelsGeneric />} />
	)

	return (
		<Layout>
			<ErrorViewSwitcher statusCode={statusCode} />
		</Layout>
	)
}

Error.propTypes = {
	statusCode: PropTypes.number
}

export async function getServerSideProps(ctx) {
	const { req, res, err } = ctx

	// Determine which layout to use, may be dev-portal's base layout.
	const urlObj = new URL(req.url, `http://${req.headers.host}`)

	// Determine which statusCode to show
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404

	if (statusCode === 404) {
		// cache 404 for one day
		res.setHeader('Cache-Control', 's-maxage=86400')
	}

	/**
	 * Determine the product context, in order to render the correct
	 * navigation header on the dev-dot 404 page.
	 */

	const pathParts = urlObj.pathname.split('/')
	const maybeProductSlug = pathParts.length > 1 && pathParts[1]
	const productSlug = isProductSlug(maybeProductSlug) ? maybeProductSlug : null

	// We need the whole product data (eg for top nav), not just the slug
	const product = productConfig[productSlug] || null

	return {
		props: {
			product,
			statusCode,
			hostname: urlObj.hostname,
		},
	}
}

export default Error
