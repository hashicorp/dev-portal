/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './docs-page-heading.module.css'

function DocsPageHeading({
	className,
	versionSelectorSlot,
	copyButtonSlot,
	headingSlot,
}: {
	/**
	 * Optional className to set `margin` on the root element.
	 */
	className?: string
	/**
	 * Heading element to render, expected to work as narrow as 28em.
	 * Layed out to occupy as much of the width of the container as it can.
	 */
	headingSlot: ReactNode
	/**
	 * Optional version select element to render alongside the heading.
	 * Layed out to never shrink below its max-content width, and yields as much
	 * space as possible to the adjacent heading element. When flex-wrap
	 * puts it on a single line, it grows to fill the container.
	 */
	versionSelectorSlot?: ReactNode
	/**
	 * Optional copy button element to render alongside the version selector.
	 */
	copyButtonSlot?: ReactNode
}) {
	return (
		<div className={classNames(s.root, className)}>
			<div className={s.controls}>
				{versionSelectorSlot ? (
					<div className={s.versionSwitcherWrapper}>{versionSelectorSlot}</div>
				) : null}
				{copyButtonSlot ? (
					<div className={s.copyButtonWrapper}>{copyButtonSlot}</div>
				) : null}
			</div>
			<div className={s.pageHeadingWrapper}>{headingSlot}</div>
		</div>
	)
}

export default DocsPageHeading
