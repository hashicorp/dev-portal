/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
import { ParameterProps } from 'views/open-api-docs-demo/types'
import s from './parameter.module.css'
import { DevCodeBlock } from '../dev-code-block'

function Parameter({ name, _data }: ParameterProps) {
	return (
		<div className={s.root}>
			<MdxInlineCode>{name}</MdxInlineCode>
			<DevCodeBlock>{JSON.stringify(_data, null, 2)}</DevCodeBlock>
		</div>
	)
}

export { Parameter }
