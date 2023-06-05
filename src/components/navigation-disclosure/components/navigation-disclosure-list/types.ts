/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'

type NativeULProps = JSX.IntrinsicElements['ul']

interface NavigationDisclosureListProps {
	/**
	 * Content to render within the internally rendered `<ul>`.
	 */
	children: ReactElement[]

	/**
	 * Optional classes to appendto the list of class names passed to the
	 * internally rendered `<ul>`.
	 */
	className?: NativeULProps['className']
}

export type { NavigationDisclosureListProps }
