import { SidebarHorizontalRule } from 'components/sidebar/components'

import { EditionFilter } from '../edition-filter'
import { ProductFilter } from '../product-filter'
import { ResourcesFilter } from '../resources-filter'
import { useFiltersState } from './use-filters-state'

/**
 * Renders all of the filters for the tutorial library
 */
export function TutorialLibraryFilters({ products, edition, resources }) {
	return (
		<div>
			<ProductFilter {...products} />
			<SidebarHorizontalRule />
			<EditionFilter {...edition} />
			<SidebarHorizontalRule />
			<ResourcesFilter resources={resources} />
		</div>
	)
}

export function ConnectedTutorialLibraryFilters() {
	const filtersState = useFiltersState()

	return <TutorialLibraryFilters {...filtersState} />
}
