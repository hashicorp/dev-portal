/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import ErrorViewSwitcher from 'views/error-view-switcher'

function Custom500() {
	const Layout = (props) => (
		<BaseLayout {...props} mobileMenuSlot={<MobileMenuLevelsGeneric />} />
	)

	return (
		<Layout>
			<ErrorViewSwitcher statusCode={500} />
		</Layout>
	)
}

export default Custom500
