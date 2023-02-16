/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import TableOfContents, {
	TableOfContentsHeading,
} from 'components/table-of-contents'
import { filterTableOfContentsHeadings } from 'components/table-of-contents/utils/filter-table-of-contents-headings'

export type SidebarSidecarWithTocProps = SidebarSidecarLayoutProps & {
	headings: TableOfContentsHeading[]
}

/**
 * Renders a SidebarSidecarLayout with a preset `<TableOfContents />`
 * component in the sidecarSlot.
 */
const SidebarSidecarWithToc = ({
	headings,
	...restProps
}: SidebarSidecarLayoutProps & { headings: TableOfContentsHeading[] }) => {
	return (
		<SidebarSidecarLayout
			{...restProps}
			sidecarSlot={
				<TableOfContents headings={filterTableOfContentsHeadings(headings)} />
			}
		/>
	)
}

export default SidebarSidecarWithToc
