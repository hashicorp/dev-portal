/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
import { ParameterProps } from 'views/open-api-docs-demo/types'
import s from './parameter.module.css'

function Parameter({ name }: ParameterProps) {
	return (
		<div className={s.root}>
			<MdxInlineCode>{name}</MdxInlineCode>
		</div>
	)
}

export { Parameter }
