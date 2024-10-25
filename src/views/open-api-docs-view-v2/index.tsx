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
import { OpenApiV2SidebarContents } from './components/sidebar'
import { SidebarHorizontalRule } from '@components/sidebar/components'
import { SidebarResourceLinks } from './components/sidebar-resource-links'
import LandingContent from './components/landing-content'
import MobileMenuLevels from '@components/mobile-menu-levels'
import OperationContent from './components/operation-content'
import SidebarBackToLink from '@components/sidebar/components/sidebar-back-to-link'
// Types
import type { OpenApiDocsViewV2Props } from './types'

/**
 * Placeholder view component for a new OpenAPI docs setup.
 *
 * This new setup will split each operation into its own URL,
 * and render an overview page at the base URL.
 */
export default function OpenApiDocsViewV2({
	basePath,
	backToLink,
	landingLink,
	operationLinkGroups,
	resourceLinks,
	productData,
	...restProps
}: OpenApiDocsViewV2Props) {
	//
	return (
		<SidebarLayout
			sidebarSlot={
				<>
					{/* Back to link, meant for navigating up a level of context */}
					{backToLink ? (
						<SidebarBackToLink href={backToLink.href} text={backToLink.text} />
					) : null}
					<OpenApiV2SidebarContents
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
			/**
			 * TODO: implement mobile menu. May be tempting to try to re-use the data
			 * that feeds the sidebar, and this MAY be the right call, or MAY make
			 * sense to have them a bit more separate (more flexibility in how we
			 * present the sidebar, without having to disentangle all the complexity
			 * of the mobile menu quite yet).
			 */
			mobileMenuSlot={
				<MobileMenuLevels
					levels={[
						mobileMenuLevelMain(),
						mobileMenuLevelProduct(productData),
						{
							levelButtonText: 'Previous',
							content: (
								<>
									<OpenApiV2SidebarContents
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
			<div style={{ padding: '24px' }}>
				<div style={{ border: '1px solid magenta' }}>
					{'operationContentProps' in restProps ? (
						<OperationContent {...restProps.operationContentProps} />
					) : 'landingContentProps' in restProps ? (
						<LandingContent {...restProps.landingContentProps} />
					) : null}
				</div>
			</div>
		</SidebarLayout>
	)
}
