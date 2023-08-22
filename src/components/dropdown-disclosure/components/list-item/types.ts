/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement, ReactNode } from 'react'
import { TextProps } from 'components/text'
import { LinkProps } from 'components/link'

/**
 * All props from the native <a> and <button> elements.
 */
type NativeAnchorProps = JSX.IntrinsicElements['a']
type NativeButtonProps = JSX.IntrinsicElements['button']

/**
 * Props that `DropdownDisclosureListItem` accepts.
 */
interface DropdownDisclosureListItemProps {
	/**
	 * The content to render within a <li> element. Expected to be one of the
	 * subcompopnents exported from this folder.
	 */
	children: ReactNode
	className?: string
}

/**
 * Props that `DropdownDisclosureButtonItem` accepts.
 */
interface DropdownDisclosureButtonItemProps {
	/**
	 * The text content to render for the item.
	 */
	children: TextProps['children']

	/**
	 * An optional icon to render to the left of the text content.
	 */
	icon?: ReactElement

	/**
	 * A callback that is invoked when the item is clicked.
	 */
	onClick: NativeButtonProps['onClick']
}

/**
 * Props that `DropdownDisclosureDescriptionItem` accepts.
 */
interface DropdownDisclosureDescriptionItemProps {
	/**
	 * The text content to render within the item.
	 */
	children: TextProps['children']
}

/**
 * Props that `DropdownDisclosureLabelItem` accepts.
 */
interface DropdownDisclosureLabelItemProps {
	/**
	 * The text content to render within the item.
	 */
	children: TextProps['children']
}

/**
 * Props that `DropdownDisclosureLinkItem` accepts.
 */
interface DropdownDisclosureLinkItemProps {
	/**
	 * The text content to render within the item.
	 */
	children: TextProps['children']

	/**
	 * The destintation the user should be taken to when the item is clicked.
	 */
	href: NativeAnchorProps['href']

	/**
	 * An optional URL to display instead of the provided `href`.
	 * The `href` will still be navigated to, but the URL will appear to
	 * be the value passed to `as`.
	 */
	as?: LinkProps['as']

	/**
	 * An optional icon to render to the left of the text content.
	 */
	icon?: ReactElement

	/**
	 * Optional [rel](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel) attribute
	 * to be passed to the internal anchor element.
	 */
	rel?: NativeAnchorProps['rel']
	target?: NativeAnchorProps['target']
	onClick?: LinkProps['onClick']
}

export type {
	DropdownDisclosureButtonItemProps,
	DropdownDisclosureDescriptionItemProps,
	DropdownDisclosureLabelItemProps,
	DropdownDisclosureLinkItemProps,
	DropdownDisclosureListItemProps,
}
