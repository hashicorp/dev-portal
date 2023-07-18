// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Local
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
// Types
import type { OpenApiDocsViewProps } from './types'

/**
 * Placeholder for a revised OpenAPI docs view.
 */
function OpenApiDocsView(props: OpenApiDocsViewProps) {
	return (
		<SidebarLayout
			sidebarSlot={
				<div style={{ border: '1px solid magenta' }}>
					PLACEHOLDER for sidebar contents
				</div>
			}
			mobileMenuSlot={<MobileMenuLevelsGeneric />}
		>
			<div style={{ border: '1px solid magenta' }}>
				<h1>OpenApiDocsView Placeholder</h1>
				<pre style={{ whiteSpace: 'pre-wrap' }}>
					<code>{JSON.stringify(props, null, 2)}</code>
				</pre>
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsView
