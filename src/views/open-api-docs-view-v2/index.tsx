/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Components
import OperationContents from './components/operation-contents'
import OverviewContents from './components/overview-contents'
import SidebarContents from './components/sidebar-contents'
// Styles
import s from './open-api-docs-view-v2.module.css'

/**
 * A revised version of OpenApiDocsView, that splits each operation
 * into its own URL.
 *
 * The intent here is to improve the user experience with manageable page sizes.
 * From there, we can move forward with implementing more complex features
 * within each operation page. Example:
 *
 * https://test-hcp-vs.readme.io/reference/settier
 *
 * TODO: this is a rough work in progress, need to revise to at least
 * match the look & feel of the previous `open-api-docs-view` template.
 *
 * TODO: need to populate the mobileMenuSlot with meaningful content,
 * for now leaving it empty and focusing on larger viewport experience.
 */
function OpenApiDocsViewV2({
	_devProps,
	operationProps,
	sidebarItemGroups,
}: {
	_devProps: $TSFixMe
	operationProps?: $TSFixMe
	sidebarItemGroups: $TSFixMe
}) {
	return (
		<SidebarLayout
			sidebarSlot={
				<SidebarContents
					_devProps={_devProps}
					sidebarItemGroups={sidebarItemGroups}
				/>
			}
			mobileMenuSlot={null} // TODO: populate mobileMenuSlot
		>
			<div className={s.paddedContainer}>
				{operationProps ? (
					<OperationContents operationProps={operationProps} />
				) : (
					<OverviewContents _devProps={_devProps} />
				)}
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsViewV2
