/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { PropsWithChildren } from 'react'
import s from './style.module.css'

function BadgesHeader({ children }: PropsWithChildren): React.ReactElement {
	const childrenArray = React.Children.toArray(children)
	return (
		<div className={s.root}>
			<div className={s.surroundSpaceCompensator}>
				{childrenArray.map((badge) => {
					return (
						<div className={s.badgeSpacer} key={badge.toString()}>
							{badge}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default BadgesHeader
