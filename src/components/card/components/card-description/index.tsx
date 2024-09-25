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
			<TruncateMaxLines className={s.text} maxLines={3}>
				{text}
			</TruncateMaxLines>
		</div>
	)
}

export type { CardDescriptionProps }
export default CardDescription
