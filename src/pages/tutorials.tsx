import algoliasearch from 'algoliasearch/lite'
import { InstantSearch } from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'
import { useRouter } from 'next/router'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import TutorialsLibraryView, {
	EditionFilter,
	ProductFilter,
	ResourcesFilter,
} from 'views/tutorials-library'
import { SidebarHorizontalRule } from 'components/sidebar/components'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID

const searchClient = algoliasearch(appId, 'bf27a047ba263cba01ee9b4081965a1a')

function FilterSidebar() {
	return (
		<div>
			<ProductFilter />
			<SidebarHorizontalRule />
			<EditionFilter />
			<SidebarHorizontalRule />
			<ResourcesFilter />
		</div>
	)
}

function routerStateToSearchState(routeState) {
	return {
		prod_LEARN: {
			query: routeState.query,
			refinementList: {
				products: routeState?.product?.split?.(',') ?? [],
			},
			menu: {
				edition: routeState.edition,
			},
			toggle: {
				hasVideo: routeState.hasVideo,
				isInteractive: routeState.isInteractive,
			},
		},
	}
}

function searchStateToRouteState(searchState) {
	const state = searchState['prod_LEARN']
	const result = {
		query: state.query,
		product: state.refinementList?.products?.join(',') || undefined,
		edition: state?.menu?.edition,
		hasVideo: state?.toggle?.hasVideo,
		isInteractive: state?.toggle?.isInteractive,
	}

	return stripUndefinedProperties(result)
}

export default function TutorialsLibraryPage({ layoutProps }) {
	const router = useRouter()

	return (
		<InstantSearch
			searchClient={searchClient}
			initialUiState={routerStateToSearchState(router.query)}
			indexName="prod_LEARN"
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
				AlternateSidebar={FilterSidebar}
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
				headings: [],
				sidebarNavDataLevels: [],
				breadcrumbLinks: [
					{ title: 'Developer', url: '/' },
					{ title: 'Tutorials', url: '/tutorials', isCurrentPage: true },
				],
			},
		},
	}
}
