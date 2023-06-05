/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from 'views/docs-view/loaders/remote-content'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import { OutlineLinkItem } from 'components/outline-nav/types'
import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import { DocsVersionAlertBanner } from './components'

/**
 * Lightweight wrapper around SidebarSidecarLayout which passes along some docs
 * specific props.
 */
const DocsViewLayout = ({
	outlineItems,
	versions,
	...layoutProps
}: SidebarSidecarLayoutProps & {
	outlineItems: OutlineLinkItem[]
	versions?: VersionSelectItem[]
}) => {
	return (
		<SidebarSidecarLayout
			{...layoutProps}
			/**
			 * Note: this slice() ensures that if the layout re-renders, then
			 * OutlineNavWithActive re-renders.
			 *
			 * TODO: Find another way.
			 * An alternate solution could be to lift up `useActiveSection`, and
			 * find elements to monitor through a ref, rather that accessing the
			 * DOM directly in `useActiveSection`.
			 *
			 * For context, with the current approach of accessing the DOM directly,
			 * we must ensure that when the content re-renders (updating heading
			 * DOM elements), the OutlineNav must also re-render (so that
			 * `useActiveSection` runs setup again and finds the updated DOM elements,
			 * rather than maintaining stale references).
			 *
			 * We took a spike at this in the following commit:
			 * https://github.com/hashicorp/dev-portal/pull/1685/commits/70a034789006df2f14afae665962c4087f2a6ba1
			 * Task:
			 * https://app.asana.com/0/1202097197789424/1204098852315293/f
			 */
			sidecarSlot={<OutlineNavWithActive items={outlineItems.slice(0)} />}
			alertBannerSlot={<DocsVersionAlertBanner versions={versions} />}
		/>
	)
}

export default DocsViewLayout
