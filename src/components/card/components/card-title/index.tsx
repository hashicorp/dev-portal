/**
 * Copyright IBM Corp. 2021, 2025
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
