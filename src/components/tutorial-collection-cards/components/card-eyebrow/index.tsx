import classNames from 'classnames'
import s from './card-eyebrow.module.css'

function CardEyebrow({
	children,
	className,
}: {
	children: any
	className?: string
}) {
	return <span className={classNames(s.eyebrow, className)}>{children}</span>
}

export { CardEyebrow }
