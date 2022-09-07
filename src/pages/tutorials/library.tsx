import algoliasearch from 'algoliasearch/lite'
import { InstantSearch } from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'
import { useRouter } from 'next/router'

import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import TutorialsLibraryView from 'views/tutorial-library'
import { ConnectedTutorialLibraryFilters } from 'views/tutorial-library/components/filters'
import { INDEX_NAME } from 'views/tutorial-library/constants'
import {
	routerStateToSearchState,
	searchStateToRouteState,
} from 'views/tutorial-library/utils/router-state'
import SidebarNavList from 'components/sidebar/components/sidebar-nav-list'
import { SidebarNavMenuItem } from 'components/sidebar/components'
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import Sidebar from 'components/sidebar'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const searchClient = algoliasearch(appId, 'bf27a047ba263cba01ee9b4081965a1a')

interface TutorialsLibraryPageProps {
	layoutProps: Omit<SidebarSidecarLayoutProps, 'sidecarSlot' | 'headings'>
}

function TutorialLibrarySidebar() {
	return (
		<Sidebar
			showFilterInput={false}
			title="Tutorial Library Menu"
			visuallyHideTitle
		>
			<div className="g-hide-with-mobile-menu">
				<ConnectedTutorialLibraryFilters />
			</div>
			<div className="g-show-with-mobile-menu">
				<SidebarNavList>
					{/* copied from: src/layouts/base-new/index.tsx */}
					<SidebarNavMenuItem item={{ heading: 'Main Menu' }} />
					{generateTopLevelSubNavItems().map(
						(item: $TSFixMe, index: number) => (
							// eslint-disable-next-line react/no-array-index-key
							<SidebarNavMenuItem item={item} key={index} />
						)
					)}
				</SidebarNavList>
			</div>
		</Sidebar>
	)
}

export default function TutorialsLibraryPage({
	layoutProps,
}: TutorialsLibraryPageProps) {
	const router = useRouter()

	return (
		<InstantSearch
			searchClient={searchClient}
			initialUiState={routerStateToSearchState(router.query)}
			indexName={INDEX_NAME}
			routing={{
				router: history(),
				stateMapping: {
					stateToRoute: searchStateToRouteState,
					routeToState: routerStateToSearchState,
				},
			}}
		>
			<SidebarSidecarLayout
				{...layoutProps}
				AlternateSidebar={TutorialLibrarySidebar}
				sidecarSlot={null}
			>
				<TutorialsLibraryView />
			</SidebarSidecarLayout>
		</InstantSearch>
	)
}

export function getStaticProps() {
	return {
		props: {
			layoutProps: {
				sidebarNavDataLevels: [],
				breadcrumbLinks: [
					{ title: 'Developer', url: '/' },
					{
						title: 'Tutorial Library',
						url: '/tutorials/library',
						isCurrentPage: true,
					},
				],
			},
		},
	}
}
