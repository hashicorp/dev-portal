/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { DisclosureContentProps } from 'components/disclosure'

interface NavigationDisclosureContentProps {
	/**
	 * The disclosed content. Expected to be a single `NavigationDisclosureList`.
	 */
	children: ReactElement

	/**
	 * Optional classes to append to the list of class names passed to the
	 * `DisclosureContent`.
	 */
	className?: DisclosureContentProps['className']
}

export type { NavigationDisclosureContentProps }
