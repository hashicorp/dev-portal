/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'

/**
 * Lightweight wrapper around SidebarSidecarLayout which passes along some docs
 * specific props.
 */
const DocsViewLayout = (props: SidebarSidecarLayoutProps) => {
	return <SidebarSidecarLayout {...props} />
}

export default DocsViewLayout
