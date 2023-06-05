/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { HeadingProps } from './types'

const Heading: React.FC<HeadingProps> = ({ level, size, weight, ...rest }) => {
	const className = classNames(
		`hds-typography-display-${size}`,
		`hds-font-weight-${weight}`,
		rest.className
	)
	const passableProps = {
		...rest,
		className,
	}

	const HeadingElement = `h${level}` as React.ElementType
	return <HeadingElement {...passableProps} />
}

export type { HeadingProps }
export default Heading
