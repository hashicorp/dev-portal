import classNames from 'classnames'
import type { HTMLAttributes, ReactNode } from 'react'
import s from './table.module.scss'

export interface TRProps extends HTMLAttributes<HTMLTableRowElement> {
	/**
	 * Elements passed as children are yielded as inner content of a `<tr>` HTML element.
	 */
	children: ReactNode
}

const TR = ({ children, className, ...rest }: TRProps) => {
	return (
		<tr className={classNames(s.tr, className)} {...rest}>
			{children}
		</tr>
	)
}

TR.displayName = 'T.TR'

export { TR }
