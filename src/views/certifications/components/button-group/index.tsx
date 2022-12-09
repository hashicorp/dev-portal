import classNames from 'classnames'
import { ReactNode } from 'react'
import s from './button-group.module.css'

export function ButtonGroup({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return <div className={classNames(s.root, className)}>{children}</div>
}
