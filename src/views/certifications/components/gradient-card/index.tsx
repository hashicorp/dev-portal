import { ReactNode } from 'react'
import classNames from 'classnames'
import { ProgramSlug } from 'views/certifications/types'
import s from './gradient-card.module.css'

/**
 * Renders a card with a pretty gradient drop shadow.
 *
 * Note: in the future we want to enhance this component by adding a
 * gradient border style as well. For now, we have the drop shadow only.
 */
function GradientCard({
	children,
	theme,
}: {
	children: ReactNode
	theme?: ProgramSlug
}) {
	return (
		<div className={s.root}>
			<div className={classNames(s.inner, s[`theme-${theme}`])}>{children}</div>
		</div>
	)
}

export { GradientCard }
