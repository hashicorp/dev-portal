/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { forwardRef } from 'react'
import classNames from 'classnames'
import { HeadingProps } from './types'
import { Text } from '@hashicorp/mds-react'

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, size, weight, ...rest }, ref) => {
	if (size === 600) {
		return (
			<Text.DisplayExpressive
				tag={`h${level}`}
				size="400"
				weight={weight}
				ref={ref}
				{...rest}
			/>
		)
	}

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
	return <HeadingElement ref={ref} {...passableProps} />
  }
)

Heading.displayName = "Heading"

export type { HeadingProps }
export default Heading
