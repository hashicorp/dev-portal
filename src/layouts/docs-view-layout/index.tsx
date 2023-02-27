/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OutlineNavWithActive } from 'components/outline-nav/components'
import { OutlineLinkItem } from 'components/outline-nav/types'
import SidebarSidecarWithToc, {
	SidebarSidecarWithTocProps,
} from 'layouts/sidebar-sidecar-with-toc'
import { DocsVersionAlertBanner } from './components'

/**
 * Lightweight wrapper around SidebarSidecarWithToc which passes along some docs
 * specific props.
 */
const DocsViewLayout = ({
	outlineItems,
	...layoutProps
}: SidebarSidecarWithTocProps & { outlineItems: OutlineLinkItem[] }) => {
	return (
		<SidebarSidecarWithToc
			{...layoutProps}
			sidecarSlot={<OutlineNavWithActive items={outlineItems} />}
			alertBannerSlot={<DocsVersionAlertBanner />}
		/>
	)
}

export default DocsViewLayout
