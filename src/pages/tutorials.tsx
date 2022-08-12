import algoliasearch from 'algoliasearch/lite'
import { InstantSearch } from 'react-instantsearch-hooks-web'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import TutorialsLibraryView, {
	EditionFilter,
	ProductFilter,
	ResourcesFilter,
} from 'views/tutorials-library'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID

const searchClient = algoliasearch(appId, 'bf27a047ba263cba01ee9b4081965a1a')

function FilterSidebar() {
	return (
		<div>
			<ProductFilter />
			<EditionFilter />
			<ResourcesFilter />
		</div>
	)
}

export default function TutorialsLibraryPage({ layoutProps }) {
	return (
		<InstantSearch searchClient={searchClient} indexName="prod_LEARN">
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

TutorialsLibraryPage

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
