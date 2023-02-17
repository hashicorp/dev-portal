/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import SidebarSidecarWithToc, {
	SidebarSidecarWithTocProps,
} from 'layouts/sidebar-sidecar-with-toc'

/**
 * Lightweight wrapper around SidebarSidecarWithToc which passes along some docs
 * specific props.
 */
const DocsViewLayout = (props: SidebarSidecarWithTocProps) => {
	return <SidebarSidecarWithToc {...props} />
}

export default DocsViewLayout
