/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import s from './style.module.css'

interface GradientBoxProps {
	children: string | React.ReactNode
}

export default function GradientBox({ children }: GradientBoxProps) {
	return (
		<div className={s.gradientBox}>
			{typeof children === 'string' ? (
				<span className={s.gradientBoxText}>{children}</span>
			) : (
				children
			)}
		</div>
	)
}
