/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import s from './style.module.css'

function TwoColumnLayout({
	columnOne,
	columnTwo,
}: {
	/** Render slot for the first column. */
	columnOne: React.ReactNode
	/** Render slot for the second column. */
	columnTwo: React.ReactNode
}): React.ReactElement {
	return (
		<div className={s.twoColumnLayout}>
			<div>{columnOne}</div>
			<div>{columnTwo}</div>
		</div>
	)
}

export default TwoColumnLayout
