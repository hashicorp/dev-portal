/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import ErrorViewSwitcher from 'views/error-view-switcher'

function Error({ statusCode }) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<ErrorViewSwitcher statusCode={statusCode} />
		</BaseLayout>
	)
}

Error.getInitialProps = ({ res, err }) => {
	let statusCode
	if (res) {
		statusCode = res.statusCode
	} else if (err) {
		statusCode = err.statusCode
	} else {
		statusCode = 404
	}
	return { statusCode }
}

export default Error
