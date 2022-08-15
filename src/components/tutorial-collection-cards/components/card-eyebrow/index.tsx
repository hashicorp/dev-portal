import classNames from 'classnames'
import { ReactElement } from 'react'
import s from './card-eyebrow.module.css'

function CardEyebrow({
	children,
	className,
}: {
	children: ReactElement[] | ReactElement
	className?: string
}) {
	return <span className={classNames(s.eyebrow, className)}>{children}</span>
}

export { CardEyebrow }
