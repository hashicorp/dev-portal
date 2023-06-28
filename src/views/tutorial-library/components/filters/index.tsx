/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { SidebarHorizontalRule } from 'components/sidebar/components'

import { EditionFilter, EditionFilterProps } from '../edition-filter'
import { ProductFilter, ProductFilterProps } from '../product-filter'
import { ResourcesFilter, ResourcesFilterProps } from '../resources-filter'
import { useFiltersState } from './use-filters-state'
import { ContentTypeFilter, ContentTypeFilterProps } from '../type-filter'

interface TutorialLibraryFiltersProps {
	products: ProductFilterProps
	edition: EditionFilterProps
	resources: ResourcesFilterProps
	contentType: ContentTypeFilterProps
}

/**
 * Renders all of the filters for the tutorial library
 */
export function TutorialLibraryFilters({
	products,
	edition,
	resources,
	contentType,
}: TutorialLibraryFiltersProps) {
	return (
		<div>
			<ProductFilter {...products} />
			<SidebarHorizontalRule />
			<EditionFilter {...edition} />
			<SidebarHorizontalRule />
			<ResourcesFilter {...resources} />
			<SidebarHorizontalRule />
			<ContentTypeFilter {...contentType} />
		</div>
	)
}

export function ConnectedTutorialLibraryFilters() {
	const filtersState = useFiltersState()

	return <TutorialLibraryFilters {...filtersState} />
}
