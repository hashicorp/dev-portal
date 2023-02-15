/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import Tabs, { Tab as MdxTab } from 'components/tabs'
import s from './mdx-tabs.module.css'

/**
 * Note: at one time, we supported a `defaultTabIdx` prop on `<Tabs />`.
 * However, this option had no known use in Docs or Tutorials content,
 * so it has since been removed.
 */
function MdxTabs({ children }: { children: ReactNode }) {
	return (
		<div className={s.tabsWrapper}>
			<Tabs allowNestedStyles>{children}</Tabs>
		</div>
	)
}

export { MdxTabs, MdxTab }
