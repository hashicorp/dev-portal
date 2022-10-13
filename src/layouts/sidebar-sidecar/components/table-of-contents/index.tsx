import { ReactElement, useMemo } from 'react'
import classNames from 'classnames'
import { useDeviceSize } from 'contexts'
import { TableOfContentsHeading, TableOfContentsProps } from './types'
import { useActiveSection } from './use-active-section'
import s from './table-of-contents.module.css'

const TABLE_OF_CONTENTS_LABEL_ID = 'table-of-contents-label'

const TableOfContents = ({ headings }: TableOfContentsProps): ReactElement => {
	const { isDesktop } = useDeviceSize()
	const hasOneOrLessHeadings = headings.length <= 1
	const enableActiveSection = hasOneOrLessHeadings ? false : isDesktop

	/**
	 * @TODO (2022-5-17) update the second argument to useActiveSection. Sidecar
	 * now goes away at 1280px rather than the isDesktop width.
	 */
	const activeSection = useActiveSection(headings, enableActiveSection)

	// Don't render if only one item
	if (hasOneOrLessHeadings) {
		return null
	}

	return (
		<nav aria-labelledby={TABLE_OF_CONTENTS_LABEL_ID}>
			<p className={s.tableOfContentsLabel} id={TABLE_OF_CONTENTS_LABEL_ID}>
				On this page
			</p>
			<ol className={s.tableOfContentsList}>
				{headings.map((heading) => (
					<TableOfContentsListItem
						isActive={heading.slug === activeSection}
						key={heading.slug}
						slug={heading.slug}
						title={heading.title}
					/>
				))}
			</ol>
		</nav>
	)
}

const TableOfContentsListItem = ({ isActive, slug, title }): ReactElement => {
	const className = classNames(s.tableOfContentsListItem, {
		[s.activeTableOfContentsListItem]: isActive,
	})
	const generatedTitle = useMemo(() => {
		const withoutBackticks = title.replace(/`/g, '')
		return withoutBackticks
	}, [title])

	return (
		<li className={className} key={slug}>
			<a className={s.tableOfContentsListItemAnchor} href={`#${slug}`}>
				{generatedTitle}
			</a>
			{isActive && <span aria-hidden className={s.activeIndicator} />}
		</li>
	)
}

export type { TableOfContentsHeading, TableOfContentsProps }
export default TableOfContents
