/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children, isValidElement, ReactElement, ReactNode } from 'react'

/**
 * Given the incoming children passed to `<ImageConfig />`,
 * validate that the children are in the expected structure.
 *
 * Return the child `<img />` element if the structure is expected,
 * throw an error otherwise.
 */
function getValidatedImgChild(children: ReactNode): ReactElement {
	// Validate that there is exactly one child element
	const childCount = Children.count(children)
	const validChildren = Children.toArray(children)
	if (childCount !== 1 || validChildren.length !== 1) {
		throw new Error(
			`In ImageConfig, found ${childCount} total children and ${validChildren.length} valid children. Please ensure that ImageConfig has exactly one child element, and ensure it is a valid image element.`
		)
	}

	// Validate that the child is a ReactElement
	const onlyChild = validChildren[0]
	if (!isValidElement(onlyChild)) {
		throw new Error(
			`In ImageConfig, found child that does not seem to be a valid React element. Please ensure that ImageConfig contains a valid image element.`
		)
	}

	// Validate that the child is either:
	// 1. a single <p><img /></p> -- expected in markdown use, ie ![](/img.jpg)
	// 2. a single <img /> -- expected when using an <img /> HTML tag
	const onlyChildType = onlyChild.props.mdxType || onlyChild.type
	const isChildImg = onlyChildType === 'img'
	const isChildP = onlyChildType === 'p'
	if (isChildImg) {
		// If the only child is <img>, that's great, return it.
		return onlyChild
	} else if (isChildP) {
		// If the only child is <p>, validate and return a single nested <img>.
		return getImgChild(onlyChild)
	} else {
		// Otherwise throw an error, this is an unexpected structure
		throw new Error(
			`In ImageConfig, found child with unexpected type: "${onlyChildType}". Please ensure that ImageConfig contains a single <img /> element. Child element details: ${JSON.stringify(
				onlyChild,
				null,
				2
			)}`
		)
	}
}

/**
 * Given a paragraph element expected to be wrapping an <img>
 * return the image element only.
 *
 * Throw an error if the elements are not structured as expected.
 */
function getImgChild(pChild: ReactElement) {
	const nestedChildren = Children.toArray(pChild.props.children)

	if (nestedChildren.length > 1) {
		console.warn(
			`Warning: <ImageConfig /> was passed multiple children. We'll filter these children to find the image element being configured. All other children will be ignored. Please ensure that ImageConfig contains only a single image element.`
		)
	}
	const nestedImgMatches = nestedChildren.filter((child) => {
		if (!isValidElement(child)) {
			return false
		}
		return (child.props.mdxType || child.type) == 'img'
	})

	if (nestedImgMatches.length == 0 || !isValidElement(nestedImgMatches[0])) {
		throw new Error(
			`In ImageConfig, could not find a valid image element. Please ensure that ImageConfig contains a valid image element. Child element details: ${JSON.stringify(
				pChild,
				null,
				2
			)}`
		)
	}

	return nestedImgMatches[0]
}

export default getValidatedImgChild
