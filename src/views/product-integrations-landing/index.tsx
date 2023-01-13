import s from './style.module.css'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import { type Integration } from 'lib/integrations-api-client/integration'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type SidebarProps } from 'components/sidebar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'

export interface ViewProps {
	integrations: Array<Integration>
	sidebarNavDataLevels: Array<SidebarProps>
	breadcrumbLinks: Array<BreadcrumbLink>
	productSlug: string
}

export default function ProductIntegrationsLanding({
	integrations,
	sidebarNavDataLevels,
	breadcrumbLinks,
	productSlug,
}: ViewProps) {
	return (
		<IntegrationsSearchProvider integrations={integrations}>
			<SidebarSidecarLayout
				sidebarNavDataLevels={sidebarNavDataLevels}
				breadcrumbLinks={breadcrumbLinks}
				sidecarSlot={<></>}
			>
				<div className={s.mainArea}>
					<div style={{ border: '1px solid magenta' }}>{productSlug}</div>
					<SearchableIntegrationsList className={s.searchList} />
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
