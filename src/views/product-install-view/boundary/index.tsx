/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// View
import ProductInstallView from 'views/product-install-view'
// Components
import { DesktopClientCallout } from './components'
// Types
import { DesktopClientProps } from './components/desktop-client-callout/types'
import { ProductInstallViewProps } from 'views/product-install-view/types'

/**
 * Render the Boundary downloads page.
 */
function BoundaryInstallView({
	desktopClientProps,
	...baseProps
}: ProductInstallViewProps & {
	desktopClientProps: DesktopClientProps
}) {
	return (
		<ProductInstallView
			{...baseProps}
			merchandisingSlot={{
				position: 'below',
				slot: <DesktopClientCallout desktopClientProps={desktopClientProps} />,
			}}
		/>
	)
}

export default BoundaryInstallView
