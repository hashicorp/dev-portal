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
import BreadcrumbBar, { BreadcrumbLink } from '@components/breadcrumb-bar'
import { OpenApiOverview } from 'views/open-api-docs-view/components'
import { ProductSlug } from 'types/products'
import VersionSwitcher from '@components/version-switcher'
import { DescriptionMdx } from 'views/open-api-docs-view/components/open-api-overview/components/description-mdx'

/**
 * TODO: wire up this content properly
 */
const CONTENT = {
	versionSwitcherProps: {
		label: 'Versions',
		/**
		 * TODO: to avoid "404 in past version" issues, maybe
		 * version switcher should always go to base route of the previous
		 * version's OpenAPI docs?
		 */
		options: [
			{
				label: '1.0',
				ariaLabel: '1.0',
				isLatest: false,
				isSelected: false,
				href: '/open-api-docs-preview-v2',
			},
			{
				label: '1.1',
				ariaLabel: '1.1',
				isLatest: true,
				isSelected: true,
				href: '/open-api-docs-preview-v2',
			},
		],
	},
	overview: {
		topOfPageHeading: {
			text: 'HCP Vault Secrets API',
			id: 'hcp-vault-secrets-api',
		},
		descriptionMdx: null,
		releaseStage: 'stable',
		serviceProductSlug: 'vault' as ProductSlug,
		statusIndicatorConfig: {
			endpointUrl: '',
			pageUrl: '',
		},
	},
}
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
	breadcrumbLinks,
}: {
	_devProps: $TSFixMe
	operationProps?: $TSFixMe
	sidebarItemGroups: $TSFixMe
	breadcrumbLinks: BreadcrumbLink[]
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
				<div className={s.spaceBreadcrumbsOverview}>
					{breadcrumbLinks ? <BreadcrumbBar links={breadcrumbLinks} /> : null}
					{operationProps ? (
						<OperationContents operationProps={operationProps} />
					) : (
						<div style={{ border: '1px solid magenta' }}>
							<OpenApiOverview
								heading={CONTENT.overview.topOfPageHeading}
								badgeText={CONTENT.overview.releaseStage}
								serviceProductSlug={CONTENT.overview.serviceProductSlug}
								statusIndicatorConfig={CONTENT.overview.statusIndicatorConfig}
								versionSwitcherSlot={
									CONTENT.versionSwitcherProps ? (
										<VersionSwitcher
											label={CONTENT.versionSwitcherProps.label}
											options={CONTENT.versionSwitcherProps.options}
										/>
									) : null
								}
								contentSlot={
									CONTENT.overview.descriptionMdx ? (
										<DescriptionMdx
											mdxRemoteProps={CONTENT.overview.descriptionMdx}
										/>
									) : null
								}
							/>
						</div>
					)}
				</div>
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsViewV2
