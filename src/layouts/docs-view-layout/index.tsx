/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import SidebarSidecarWithToc, {
	SidebarSidecarWithTocProps,
} from 'layouts/sidebar-sidecar-with-toc'
import { DocsVersionAlertBanner } from './components'

/**
 * Lightweight wrapper around SidebarSidecarWithToc which passes along some docs
 * specific props.
 */
const DocsViewLayout = (props: SidebarSidecarWithTocProps) => {
	return (
		<SidebarSidecarWithToc
			{...props}
			alertBannerSlot={<DocsVersionAlertBanner />}
		/>
	)
}

export default DocsViewLayout
