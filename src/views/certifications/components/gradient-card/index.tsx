/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './gradient-card.module.css'

// Temporary type used to determine the theme of the gradient card
type GradientCardTheme = 'terraform' | 'vault'

/**
 * Renders a card with a pretty gradient drop shadow.
 *
 * Note: in the future we want to enhance this component by adding a
 * gradient border style as well. For now, we have the drop shadow only.
 */

// Note: Need to update the theme to remove the "infrastructure-automation" and "security-automation"; Clear any dependencies
function GradientCard({
	children,
	theme,
}: {
	children: ReactNode
	theme?: GradientCardTheme | 'infrastructure-automation' | 'security-automation'
}) {
	return (
		<div className={s.root}>
			<div
				className={classNames(s.gradientBorderBackground, s[`theme-${theme}`])}
			/>
			<div className={s.inner}>{children}</div>
		</div>
	)
}

export { GradientCard, type GradientCardTheme }
