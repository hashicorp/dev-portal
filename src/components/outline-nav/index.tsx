/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useId } from '@react-aria/utils'
import Button from 'components/button'
import { OutlineListItems } from './components'
import type { OutlineNavProps } from './types'
import s from './outline-nav.module.css'

/**
 * Render a <nav> element, with an "On this page" label,
 * and an ordered list of links. Intended for use with #jump-links.
 */
function OutlineNav({ items }: OutlineNavProps) {
	const uniqueId = useId()

	return (
		<>
			<p className={s.navLabel}>Configuration</p>
			<Button
				color="secondary"
				text="Consul Edition: HCP"
				onClick={() => {
					window.scrollTo({ top: 0, behavior: 'smooth' })
				}}
			/>
			<br />
			<nav aria-labelledby={uniqueId}>
				<p id={uniqueId} className={s.navLabel}>
					On this page:
				</p>
				<ol className={s.listRoot}>
					<OutlineListItems items={items} />
				</ol>
			</nav>
		</>
	)
}

export type { OutlineNavProps }
export default OutlineNav
