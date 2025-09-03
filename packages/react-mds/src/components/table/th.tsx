import classNames from 'classnames'
import { DEFAULT_ALIGNMENT, DEFAULT_SCOPE } from './utils'
import { useId, type HTMLAttributes, type ReactNode } from 'react'
import { ThButtonTooltip } from './th-button-tooltip'
import type { HorizontalAlignment, Scope } from './utils'
import s from './table.module.scss'

export interface THProps extends HTMLAttributes<HTMLTableCellElement> {
	/**
	 * Determines the horizontal content alignment (sometimes referred to as text alignment) for the column header.
	 */
	align?: HorizontalAlignment
	/**
	 * If used as the first item in a table body’s row, scope should be set to row for accessibility purposes.
	 */
	scope?: Scope
	/**
	 * Any valid CSS
	 * If set, determines the column’s width.
	 */
	width?: string
	/**
	 * Text string which will appear in the tooltip. May contain basic HTML tags for formatting text such as strong and em tags. Not intended for multi-paragraph text or other more complex content. May not contain interactive content such as links or buttons. The placement and offset are automatically set and can’t be overwritten.
	 */
	tooltip?: string
	/**
	 * If set to `true`, it visually hides the column’s text content (it will still be available to screen readers for accessibility).
	 */
	isVisuallyHidden?: boolean
	/**
	 * Elements passed as children are yielded as inner content of a `<th>` HTML element.
	 */
	children: ReactNode
}

const TH = ({
	align = DEFAULT_ALIGNMENT,
	width,
	scope = DEFAULT_SCOPE,
	tooltip,
	isVisuallyHidden,
	children,
	className,
	...rest
}: THProps) => {
	const labelId = useId()
	let content: React.ReactNode

	if (isVisuallyHidden) {
		content = <span className="sr-only">{children}</span>
	} else if (tooltip) {
		content = (
			<div className={s.content}>
				<span id={labelId}>{children}</span>
				<ThButtonTooltip tooltip={tooltip} labelId={labelId} />
			</div>
		)
	} else {
		content = <div className={s.content}>{children}</div>
	}

	return (
		<th
			className={classNames(
				s.th,
				s[`align-${align}`],
				'token-typography-body-200',
				'mds-typography-font-weight-semibold',
				className
			)}
			style={width ? { width, minWidth: width } : {}}
			{...rest}
			scope={scope}
		>
			{content}
		</th>
	)
}

TH.displayName = 'H.TH'

export { TH }
