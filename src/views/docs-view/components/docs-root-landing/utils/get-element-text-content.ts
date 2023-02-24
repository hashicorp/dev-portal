/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children, ReactChild, ReactElement } from 'react'

/**
 * Given a React element,
 * Return the text content of that element.
 */
export function getElementTextContent(element: ReactElement) {
	let textContent = ''
	Children.forEach(element.props.children, (child: ReactChild) => {
		if (typeof child === 'string') {
			textContent += child
		}
	})
	return textContent
}
