/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import { TableOfContentsHeading } from 'components/table-of-contents'
import { filterTableOfContentsHeadings } from 'components/table-of-contents/utils/filter-table-of-contents-headings'
import { OutlineNavFromHeadings } from 'components/outline-nav/components'

export type SidebarSidecarWithTocProps = SidebarSidecarLayoutProps & {
	headings: TableOfContentsHeading[]
}

/**
 * Renders a SidebarSidecarLayout with a preset `<OutlineNav />`
 * component in the sidecarSlot.
 */
function SidebarSidecarWithToc(props: SidebarSidecarWithTocProps) {
	const { headings, ...restProps } = props
	return (
		<SidebarSidecarLayout
			{...restProps}
			sidecarSlot={
				<OutlineNavFromHeadings
					headings={filterTableOfContentsHeadings(headings)}
				/>
			}
		/>
	)
}

export default SidebarSidecarWithToc
