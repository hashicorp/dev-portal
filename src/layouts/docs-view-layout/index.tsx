/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OutlineNavWithActive } from 'components/outline-nav/components'
import { OutlineLinkItem } from 'components/outline-nav/types'
import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import { DocsVersionAlertBanner } from './components'

/**
 * Lightweight wrapper around SidebarSidecarWithToc which passes along some docs
 * specific props.
 */
const DocsViewLayout = ({
	outlineItems,
	...layoutProps
}: SidebarSidecarLayoutProps & { outlineItems: OutlineLinkItem[] }) => {
	return (
		<SidebarSidecarLayout
			{...layoutProps}
			sidecarSlot={<OutlineNavWithActive items={outlineItems} />}
			alertBannerSlot={<DocsVersionAlertBanner />}
		/>
	)
}

export default DocsViewLayout
