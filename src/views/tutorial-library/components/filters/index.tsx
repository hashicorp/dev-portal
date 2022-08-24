import { SidebarHorizontalRule } from 'components/sidebar/components'

import { EditionFilter } from '../edition-filter'
import { ProductFilter } from '../product-filter'
import { ResourcesFilter } from '../resources-filter'

/**
 * Renders all of the filters for the tutorial library
 */
export function TutorialLibraryFilters() {
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
