/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { forwardRef } from 'react'
import classNames from 'classnames'
import { HeadingProps } from './types'
import { Text } from '@hashicorp/mds-react/components'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, size, weight, ...rest }, ref) => {
	const tag = `h${level}` satisfies HeadingTag

	if (size === 600) {
		return (
			<Text.DisplayExpressive
				tag={tag}
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

	const HeadingElement = tag
	return <HeadingElement ref={ref} {...passableProps} />
  }
)

Heading.displayName = "Heading"

export type { HeadingProps }
export default Heading
