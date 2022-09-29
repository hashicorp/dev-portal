// View
import ProductDownloadsView from 'views/product-downloads-view'
// Components
import { DesktopClientCallout } from './components'
// Types
import { DesktopClientProps } from './components/desktop-client-callout/types'
import { ProductDownloadsViewProps } from 'views/product-downloads-view/types'

/**
 * Render the Boundary downloads page.
 */
function BoundaryDownloadsView({
	desktopClientProps,
	...baseProps
}: ProductDownloadsViewProps & {
	desktopClientProps: DesktopClientProps
}) {
	return (
		<ProductDownloadsView
			{...baseProps}
			merchandisingSlot={
				<DesktopClientCallout desktopClientProps={desktopClientProps} />
			}
		/>
	)
}

export default BoundaryDownloadsView
