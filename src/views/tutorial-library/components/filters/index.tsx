import { SidebarHorizontalRule } from 'components/sidebar/components'

import { EditionFilter, EditionFilterProps } from '../edition-filter'
import { ProductFilter, ProductFilterProps } from '../product-filter'
import { ResourcesFilter, ResourcesFilterProps } from '../resources-filter'
import { useFiltersState } from './use-filters-state'

interface TutorialLibraryFiltersProps {
	products: ProductFilterProps
	edition: EditionFilterProps
	resources: ResourcesFilterProps
}

/**
 * Renders all of the filters for the tutorial library
 */
export function TutorialLibraryFilters({
	products,
	edition,
	resources,
}: TutorialLibraryFiltersProps) {
	return (
		<div>
			<ProductFilter {...products} />
			<SidebarHorizontalRule />
			<EditionFilter {...edition} />
			<SidebarHorizontalRule />
			<ResourcesFilter {...resources} />
		</div>
	)
}

export function ConnectedTutorialLibraryFilters() {
	const filtersState = useFiltersState()

	return <TutorialLibraryFilters {...filtersState} />
}
