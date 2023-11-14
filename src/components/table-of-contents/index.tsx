/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement, useMemo } from 'react'
import classNames from 'classnames'
import { useDeviceSize } from 'contexts'
import { useActiveSection } from 'lib/hash-links/use-active-section'
import { TableOfContentsHeading, TableOfContentsProps } from './types'
import s from './table-of-contents.module.css'

const TABLE_OF_CONTENTS_LABEL_ID = 'table-of-contents-label'

const TableOfContents = ({ headings }: TableOfContentsProps): ReactElement => {
	const { isDesktop } = useDeviceSize()
	const hasManyHeadings = headings.length >= 1
	const enableActiveSection = hasManyHeadings && isDesktop

	/**
	 * @TODO (2022-5-17) update the second argument to useActiveSection. Sidecar
	 * now goes away at 1280px rather than the isDesktop width.
	 *
	 * Thought: visibility-based approach?
	 * One option here might be to set `enableActiveSection` based
	 * on whether the `nav` element rendered here is visible.
	 * If we're hiding the sidecar in CSS, the `nav` element will not be visible,
	 * and we'll pass `enableActiveSection = false`.
	 * If we're at a breakpoint where the sidecar is visible, the `nav` element
	 * will be visible, and we'll pass `enableActiveSection = true`.
	 * A hook like `useOnScreen` might come in handy:
	 * https://usehooks.com/useOnScreen/
	 *
	 * With this visibility-based approach, we might no longer have to rely
	 * on specific breakpoint pixel values.
	 */
	const headingSlugs = headings.map((h) => h.slug)
	const activeSection = useActiveSection(headingSlugs, enableActiveSection)

	// Don't render if only one item
	if (!hasManyHeadings) {
		return null
	}

	return (
		<nav aria-labelledby={TABLE_OF_CONTENTS_LABEL_ID}>
			<p className={s.tableOfContentsLabel} id={TABLE_OF_CONTENTS_LABEL_ID}>
				On this page
			</p>
			<ol className={s.tableOfContentsList}>
				{headings.map((heading, index) => (
					<TableOfContentsListItem
						isActive={heading.slug === activeSection}
						key={heading.slug}
						slug={heading.slug}
						title={heading.title}
						index={index}
					/>
				))}
			</ol>
		</nav>
	)
}

function TableOfContentsListItem({
	isActive,
	slug,
	title,
	index,
}: {
	isActive: boolean
	slug: string
	title: string
	index: number
}): ReactElement {
	const className = classNames(s.tableOfContentsListItem, {
		[s.activeTableOfContentsListItem]: isActive,
	})
	const generatedTitle = useMemo(() => {
		const withoutBackticks = title.replace(/`/g, '')
		return withoutBackticks
	}, [title])

	return (
		<li className={className} key={slug}>
			<a
				className={s.tableOfContentsListItemAnchor}
				href={`#${slug}`}
				data-heap-track={`toc-list-item-index-${index}`}
			>
				{generatedTitle}
			</a>
			{isActive && <span aria-hidden className={s.activeIndicator} />}
		</li>
	)
}

export type { TableOfContentsHeading, TableOfContentsProps }
export default TableOfContents
