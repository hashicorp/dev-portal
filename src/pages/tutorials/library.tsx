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

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const searchClient = algoliasearch(appId, 'bf27a047ba263cba01ee9b4081965a1a')

interface TutorialsLibraryPageProps {
	layoutProps: Omit<SidebarSidecarLayoutProps, 'sidecarSlot' | 'headings'>
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
				AlternateSidebar={ConnectedTutorialLibraryFilters}
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
