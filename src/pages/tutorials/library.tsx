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
import { getTutorials } from 'lib/learn-client/api/tutorial'
import { Tutorial } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'

const DEFAULT_SLUGS = [
	'terraform/infrastructure-as-code',
	'vault/getting-started-intro',
	'consul/get-started',
	'nomad/get-started-install',
	'vagrant/getting-started-index',
	'packer/get-started-install-cli',
	'boundary/getting-started-intro',
	'waypoint/get-started-intro',
	'cloud/terraform-hcp-provider-vault',
]

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const searchClient = algoliasearch(appId, 'bf27a047ba263cba01ee9b4081965a1a')

interface TutorialsLibraryPageProps {
	layoutProps: Omit<SidebarSidecarLayoutProps, 'sidecarSlot' | 'headings'>
	defaultTutorials: Omit<Tutorial, 'content'>[]
}

function TutorialLibrarySidebar() {
	return (
		// TODO: we should consider using Sidebar here to make the markup consistent across pages. We aren't for now due to duplicate "Resources" headings and Tutorial Library being a semi-special case.
		<>
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
		</>
	)
}

export default function TutorialsLibraryPage({
	layoutProps,
	defaultTutorials,
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
				<TutorialsLibraryView defaultTutorials={defaultTutorials} />
			</SidebarSidecarLayout>
		</InstantSearch>
	)
}

export async function getStaticProps() {
	return {
		props: stripUndefinedProperties({
			metadata: {
				title: 'Tutorial Library',
				description: 'Explore our tutorials to automate your workflows.',
			},
			defaultTutorials: await getTutorials(DEFAULT_SLUGS),
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
		}),
	}
}
