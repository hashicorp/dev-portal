import { ReactElement } from 'react'
import classNames from 'classnames'
import { useDeviceSize } from 'contexts'
import getTruncatedTitle from './utils/get-truncated-title'
import { TableOfContentsHeading, TableOfContentsProps } from './types'
import { useActiveSection } from './use-active-section'
import s from './table-of-contents.module.css'

const TABLE_OF_CONTENTS_LABEL_ID = 'table-of-contents-label'

const TableOfContents = ({ headings }: TableOfContentsProps): ReactElement => {
  const { isDesktop } = useDeviceSize()
  const activeSection = useActiveSection(headings, isDesktop)

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
  const truncatedTitle = getTruncatedTitle(title)

  return (
    <li className={className} key={slug}>
      <a className={s.tableOfContentsListItemAnchor} href={`#${slug}`}>
        {truncatedTitle}
      </a>
      {isActive && <span aria-hidden className={s.activeIndicator} />}
    </li>
  )
}

export type { TableOfContentsHeading, TableOfContentsProps }
export default TableOfContents
