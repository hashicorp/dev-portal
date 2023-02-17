/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import React from 'react'
import styles from './style.module.css'

interface LongformPageProps {
	className?: string
	title?: string
	alert?: React.ReactNode
	children: React.ReactNode
}

export default function LongformPage({
	className,
	title,
	alert,
	children,
}: LongformPageProps): React.ReactElement {
	return (
		<div className={classNames(styles.longformPage, className)}>
			<div className="g-grid-container">
				<div className={styles.longformWrapper}>
					{alert && <div className={styles.alert}>{alert}</div>}
					<h2 className="g-type-display-2">{title}</h2>
					{children}
				</div>
			</div>
		</div>
	)
}
