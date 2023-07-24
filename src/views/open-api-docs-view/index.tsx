// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Components
import SidebarBackToLink from 'components/sidebar/components/sidebar-back-to-link'
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
			sidebarSlot={
				<>
					<SidebarBackToLink text="HashiCorp Cloud Platform" href="/hcp" />
					<OpenApiSidebarContents operationGroups={operationGroups} />
				</>
			}
			mobileMenuSlot={
				<OpenApiDocsMobileMenuLevels
					productData={productData}
					operationGroups={operationGroups}
				/>
			}
		>
			<OpenApiOverview _placeholder={_placeholder} />
			<OpenApiOperations operationGroups={operationGroups} />
		</SidebarLayout>
	)
}

export default OpenApiDocsView
