/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import TruncateMaxLines from 'components/truncate-max-lines'
import { CardDescriptionProps } from './types'
import s from './card-description.module.css'

const CardDescription = ({ className, text }: CardDescriptionProps) => {
	return (
		<div className={classNames(s.root, className)}>
			<TruncateMaxLines
				className={s.text}
				lineHeight="var(--token-typography-body-200-line-height)"
				maxLines={3}
			>
				{text}
			</TruncateMaxLines>
		</div>
	)
}

export type { CardDescriptionProps }
export default CardDescription
