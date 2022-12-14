import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './split-card-section.module.css'

/**
 * Flex layout wrapper for split sections within a Card component.
 *
 * Use cases include program summary cards on the /certifications landing,
 * and exam summary cards on /certifications/<program-slug> pages.
 */
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
