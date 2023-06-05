/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import ProductViewContent from 'views/product-tutorials-view/components/product-view-content'
import HeroHeadingVisual from 'views/product-landing/components/hero-heading-visual'
import { SidebarProps } from 'components/sidebar'
import OverviewCta from 'views/product-landing/components/overview-cta'
import { WellArchitectedFrameworkLandingProps } from './types'
import s from './well-architected-framework-landing.module.css'
import { generateWafCollectionSidebar } from './utils/generate-collection-sidebar'

export default function WellArchitectedFrameworkLandingView(
	props: WellArchitectedFrameworkLandingProps
) {
	const { data, outlineItems, layoutProps, metadata } = props
	const { blocks } = data.pageData
	const { hero, overview } = data.wafContent

	return (
		<SidebarSidecarLayout
			sidecarSlot={<OutlineNavWithActive items={outlineItems.slice()} />}
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(metadata.name) as SidebarProps,
				generateWafCollectionSidebar(metadata, layoutProps.sidebarSections),
			]}
		>
			<div className={s.hero}>
				<HeroHeadingVisual {...hero} />
			</div>
			<div className={s.overview}>
				<OverviewCta
					{...overview}
					headingSlug={slugify(overview.heading, { lower: true })}
				/>
			</div>
			<ProductViewContent blocks={blocks} />
		</SidebarSidecarLayout>
	)
}

WellArchitectedFrameworkLandingView.contentType = 'tutorials'
