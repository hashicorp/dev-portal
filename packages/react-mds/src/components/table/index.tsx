import classNames from 'classnames'
import { TD } from './td'
import { TH } from './th'
import { TR } from './tr'
import type { HTMLAttributes, ReactNode } from 'react'
import {
	DEFAULT_DENSITY,
	DEFAULT_VERTICAL_ALIGNMENT,
	type Density,
	type VerticalAlignment,
} from './utils'
import s from './table.module.scss'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
	/**
	 * Define on the table invocation. If set to `true`, even-numbered rows will have a different background color from odd-numbered rows.
	 */
	isStriped?: boolean
	/**
	 * If set to `true`, the `table-display`(CSS) property will be set to fixed. See [MDN reference on table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) for more details.
	 */
	isFixedLayout?: boolean
	/**
	 * If set, determines the density (height) of the table body’s rows.
	 */
	density?: Density
	/**
	 * Determines the vertical alignment for content in a table. Does not apply to table headers (`th`). See [MDN reference on vertical-align](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align) for more details.
	 */
	valign?: VerticalAlignment
	/**
	 * Adds a (non-visible) caption for users with assistive technology. If set on a sortable table, the provided table caption is paired with the automatically generated sorted message text.
	 */
	caption?: string
}

function Root({
	caption,
	density = DEFAULT_DENSITY,
	valign = DEFAULT_VERTICAL_ALIGNMENT,
	isStriped,
	isFixedLayout,
	children,
	className,
	...rest
}: TableProps) {
	return (
		<table
			className={classNames(
				s.table,
				s[`density-${density}`],
				s[`valign-${valign}`],
				{
					[s.striped]: isStriped,
					[s['layout-fixed']]: isFixedLayout,
				},
				className
			)}
			{...rest}
		>
			{caption && <caption className="sr-only">{caption}</caption>}
			{children}
		</table>
	)
}
Root.displayName = 'Table'

function THead({ children }: { children: ReactNode }) {
	return <thead className={s.thead}>{children}</thead>
}
THead.displayName = 'T.Head'

function TBody({ children }: { children: ReactNode }) {
	return <tbody className={s.tbody}>{children}</tbody>
}
TBody.displayName = 'T.Body'

const Table = { Root, TR, THead, TH, TBody, TD }

export { Table }
