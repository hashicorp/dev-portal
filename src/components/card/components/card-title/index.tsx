/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CardTitleProps } from './types'
import s from './card-title.module.css'

const CardTitle = ({ className, text }: CardTitleProps) => {
	return (
		<div className={className}>
			<span className={s.text}>{text}</span>
		</div>
	)
}

export type { CardTitleProps }
export default CardTitle
