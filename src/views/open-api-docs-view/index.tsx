// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Local
import {
	OpenApiDocsMobileMenuLevels,
	OpenApiOverview,
	OpenApiSidebarContents,
	OpenApiOperations,
} from './components'
// Types
import type { OpenApiDocsViewProps } from './types'

/**
 * Placeholder for a revised OpenAPI docs view.
 */
function OpenApiDocsView({
	productData,
	operationGroups,
	_placeholder,
}: OpenApiDocsViewProps) {
	return (
		<SidebarLayout
			sidebarSlot={<OpenApiSidebarContents operationGroups={operationGroups} />}
			mobileMenuSlot={<OpenApiDocsMobileMenuLevels productData={productData} />}
		>
			<OpenApiOverview _placeholder={_placeholder} />
			<OpenApiOperations operationGroups={operationGroups} />
		</SidebarLayout>
	)
}

export default OpenApiDocsView
