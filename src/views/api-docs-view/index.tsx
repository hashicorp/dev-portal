/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import VersionSwitcher from 'components/version-switcher'
import NoIndexTagIfVersioned from 'components/no-index-tag-if-versioned'
import OperationObject from 'components/open-api-page/partials/operation-object'
import DocsPageHeading from 'views/docs-view/components/docs-page-heading'
// Local
import { ApiDocsVersionAlert, HeadingWithBadge } from './components'
// Types
import type { ApiDocsViewProps } from 'views/api-docs-view/types'
import type { OperationObjectType } from 'components/open-api-page/types'
// Styles
import s from './api-docs-view.module.css'

/**
 * Render an API docs view.
 *
 * When `serviceData` is provided, detailed operation objects are shown.
 * Otherwise, a prompt to select an operation from the sidebar is shown.
 */
function ApiDocsView({
	alertSlot,
	pageHeading,
	layoutProps,
	serviceData,
	massagePathFn = (path: string) => path,
	renderOperationIntro,
	isVersionedUrl,
	versionAlert,
	versionSwitcherData,
}: ApiDocsViewProps) {
	/**
	 * We always render the API docs name in a heading-styled element.
	 *
	 * When `serviceData.name` is provided, we'll render the service name
	 * in an `h1` element, as the `serviceName` is a more meaningful page title.
	 * In such cases, our page heading needs to be a `p` element to avoid
	 * having multiple `h1` elements on the page.
	 */
	const pageHeadingTag = serviceData?.name ? 'p' : 'h1'

	/**
	 * We only show the version switcher if we have at least 2 options.
	 */
	const showVersionSwitcher = versionSwitcherData?.options?.length > 1

	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={layoutProps.sidebarNavDataLevels}
			alertBannerSlot={<ApiDocsVersionAlert {...versionAlert} />}
		>
			<NoIndexTagIfVersioned isVersioned={isVersionedUrl} />
			{alertSlot ? alertSlot : null}
			<DocsPageHeading
				headingSlot={
					<HeadingWithBadge
						elem={pageHeadingTag}
						text={pageHeading.text}
						badgeText={pageHeading.badgeText}
					/>
				}
				versionSelectorSlot={
					showVersionSwitcher ? (
						<VersionSwitcher
							label={versionSwitcherData.label}
							options={versionSwitcherData.options}
						/>
					) : null
				}
			/>
			{serviceData ? (
				<div className={s.serviceData}>
					{serviceData.name ? (
						<h1 className={s.serviceHeading}>{serviceData.name}</h1>
					) : null}
					{serviceData.operations.map((operation: OperationObjectType) => {
						return (
							<OperationObject
								key={operation.__type + operation.__path}
								type={operation.__type}
								data={operation}
								path={massagePathFn(operation.__path)}
								renderOperationIntro={renderOperationIntro}
							/>
						)
					})}
				</div>
			) : (
				<p className={s.sidebarPrompt}>Select a service from the sidebar.</p>
			)}
		</SidebarSidecarLayout>
	)
}

export default ApiDocsView
