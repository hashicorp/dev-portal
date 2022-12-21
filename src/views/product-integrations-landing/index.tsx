import s from './style.module.css'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import { type Integration } from 'lib/integrations-api-client/integration'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type SidebarProps } from 'components/sidebar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'

interface ViewProps {
	integrations: Array<Integration>
	sidebarNavDataLevels: Array<SidebarProps>
	breadcrumbLinks: Array<BreadcrumbLink>
}

export default function ProductIntegrationsLanding({
	integrations,
	sidebarNavDataLevels,
	breadcrumbLinks,
}: ViewProps) {
	return (
		<IntegrationsSearchProvider integrations={integrations}>
			<SidebarSidecarLayout
				sidebarNavDataLevels={sidebarNavDataLevels}
				breadcrumbLinks={breadcrumbLinks}
				sidecarSlot={<></>}
			>
				<div className={s.mainArea}>
					<SearchableIntegrationsList className={s.searchList} />
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
