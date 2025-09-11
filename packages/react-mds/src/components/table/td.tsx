import classNames from 'classnames'
import { DEFAULT_ALIGNMENT, type HorizontalAlignment } from './utils'
import type { HTMLAttributes, ReactNode } from 'react'
import s from './table.module.scss'

export interface TDProps extends HTMLAttributes<HTMLTableCellElement> {
	/**
	 * Determines the horizontal content alignment (sometimes referred to as text alignment) for the cell (make sure it is also set for the column header).
	 */
	align?: HorizontalAlignment
	/**
	 * Elements passed as children are yielded as inner content of a <td> HTML element.
	 */
	children: ReactNode
}

const TD = ({
	align = DEFAULT_ALIGNMENT,
	children,
	className,
	...rest
}: TDProps) => {
	return (
		<td
			className={classNames(
				s.td,
				s[`align-${align}`],
				'token-typography-body-200',
				'mds-typography-font-weight-regular',
				className
			)}
			{...rest}
		>
			<div className={s.content}>{children}</div>
		</td>
	)
}

TD.displayName = 'B.Td'

export { TD }
