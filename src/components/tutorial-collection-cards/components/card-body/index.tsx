/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import TruncateMaxLines from 'components/truncate-max-lines'
import s from './card-body.module.css'

function CardBody({ text }: { text: string }) {
	return (
		<p className={s.body}>
			<TruncateMaxLines maxLines={3}>{text}</TruncateMaxLines>
		</p>
	)
}

export { CardBody }
