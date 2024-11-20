/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Components
import {
	mobileMenuLevelMain,
	mobileMenuLevelProduct,
} from '@components/mobile-menu-levels/level-components'
import { SidebarHorizontalRule } from '@components/sidebar/components'
import MobileMenuLevels from '@components/mobile-menu-levels'
import SidebarBackToLink from '@components/sidebar/components/sidebar-back-to-link'
import BreadcrumbBar from '@components/breadcrumb-bar'
import VersionSwitcher from '@components/version-switcher'
import NoIndexTagIfVersioned from '@components/no-index-tag-if-versioned'
// Components, local
import { OpenApiSidebarContents } from './components/sidebar'
import { SidebarResourceLinks } from './components/sidebar-resource-links'
import { LandingContent } from './components/landing-content'
import OperationContent from './components/operation-content'
import { OpenApiVersionAlert } from './components/version-alert'
// Types
import type { OpenApiDocsViewProps } from './types'
// Styles
import s from './style.module.css'

/**
 * Placeholder view component for a new OpenAPI docs setup.
 *
 * This new setup will split each operation into its own URL,
 * and render an overview page at the base URL.
 */
export default function OpenApiDocsView({
	basePath,
	backToLink,
	breadcrumbLinks,
	landingLink,
	operationLinkGroups,
	resourceLinks,
	product,
	versionMetadata,
	versionSwitcherProps,
	...restProps
}: OpenApiDocsViewProps) {
	//
	return (
		<SidebarLayout
			sidebarSlot={
				<>
					{backToLink ? (
						<SidebarBackToLink href={backToLink.href} text={backToLink.text} />
					) : null}
					<OpenApiSidebarContents
						landingLink={landingLink}
						operationLinkGroups={operationLinkGroups}
					/>
					{resourceLinks.length > 0 ? (
						<>
							<SidebarHorizontalRule />
							<SidebarResourceLinks resourceLinks={resourceLinks} />
						</>
					) : null}
				</>
			}
			mobileMenuSlot={
				<MobileMenuLevels
					levels={[
						mobileMenuLevelMain(),
						mobileMenuLevelProduct(product),
						{
							levelButtonText: 'Previous',
							content: (
								<>
									<OpenApiSidebarContents
										landingLink={landingLink}
										operationLinkGroups={operationLinkGroups}
									/>
									{resourceLinks.length > 0 ? (
										<>
											<SidebarHorizontalRule />
											<SidebarResourceLinks resourceLinks={resourceLinks} />
										</>
									) : null}
								</>
							),
						},
					]}
				/>
			}
		>
			<OpenApiVersionAlert
				isVersionedUrl={versionMetadata.isVersionedUrl}
				currentVersion={versionMetadata.currentVersion}
				latestStableVersion={versionMetadata.latestStableVersion}
				basePath={basePath}
			/>
			<NoIndexTagIfVersioned isVersioned={versionMetadata.isVersionedUrl} />
			<div className={s.paddedContainer}>
				<div className={s.spaceBreadcrumbsContent}>
					<BreadcrumbBar links={breadcrumbLinks} />
					{'operationContentProps' in restProps ? (
						<OperationContent
							{...restProps.operationContentProps}
							versionSwitcherSlot={
								versionSwitcherProps ? (
									<VersionSwitcher
										label={versionSwitcherProps.label}
										options={versionSwitcherProps.options}
									/>
								) : null
							}
						/>
					) : 'landingProps' in restProps ? (
						<LandingContent
							versionSwitcherSlot={
								versionSwitcherProps ? (
									<VersionSwitcher
										label={versionSwitcherProps.label}
										options={versionSwitcherProps.options}
									/>
								) : null
							}
							heading={restProps.landingProps.heading}
							badgeText={restProps.landingProps.badgeText}
							serviceProductSlug={restProps.landingProps.serviceProductSlug}
							statusIndicatorConfig={
								restProps.landingProps.statusIndicatorConfig
							}
							descriptionMdx={restProps.landingProps.descriptionMdx}
							schemaFileString={restProps.landingProps.schemaFileString}
						/>
					) : null}
				</div>
			</div>
		</SidebarLayout>
	)
}
