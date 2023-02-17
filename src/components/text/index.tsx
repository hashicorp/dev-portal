/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { TextProps } from './types'
import s from './text.module.css'

const Text: React.FC<TextProps> = ({
	asElement = 'p',
	size = 300,
	weight = 'regular',
	...rest
}: TextProps) => {
	const className = classNames(
		s.root,
		`hds-typography-body-${size}`,
		`hds-font-weight-${weight}`,
		rest.className
	)
	const passableProps = {
		...rest,
		className,
	}

	const TextElement = asElement as React.ElementType
	return <TextElement {...passableProps} />
}

export type { TextProps }
export default Text
