import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './gradient-card.module.css'

type GradientCardTheme =
	| 'infrastructure-automation'
	| 'security-automation'
	| 'networking-automation'

function GradientCard({
	children,
	theme,
}: {
	children: ReactNode
	theme?: GradientCardTheme
}) {
	return (
		<div className={s.root}>
			<div className={classNames(s.inner, s[`theme-${theme}`])}>{children}</div>
		</div>
	)
}

export type { GradientCardTheme }
export { GradientCard }
