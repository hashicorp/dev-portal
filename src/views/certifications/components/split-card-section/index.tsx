import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './split-card-section.module.css'

export function SplitCardSection({
	startContent,
	endContent,
	className,
}: {
	startContent: ReactNode
	endContent: ReactNode
	className?: string
}) {
	return (
		<div className={classNames(s.root, className)}>
			<div className={s.startContent}>{startContent}</div>
			<div className={s.endContent}>{endContent}</div>
		</div>
	)
}
