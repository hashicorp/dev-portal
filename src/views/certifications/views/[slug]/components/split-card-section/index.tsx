import { ReactNode } from 'react'
import s from './split-card-section.module.css'

export function SplitCardSection({
	startContent,
	endContent,
}: {
	startContent: ReactNode
	endContent: ReactNode
}) {
	return (
		<div className={s.root}>
			<div className={s.startContent}>{startContent}</div>
			<div className={s.endContent}>{endContent}</div>
		</div>
	)
}
