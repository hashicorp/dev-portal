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
		<div className={classNames(s.root, s[`theme-${theme}`])}>{children}</div>
	)
}

export type { GradientCardTheme }
export { GradientCard }
