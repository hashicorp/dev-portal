import { ReactElement, ReactNode } from 'react'
import { TextProps } from 'components/text'

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
	 * An optional icon to render to the left of the text content.
	 */
	icon?: ReactElement

	/**
	 * Optional [rel](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel) attribute
	 * to be passed to the internal anchor element.
	 */
	rel?: NativeAnchorProps['rel']
}

export type {
	DropdownDisclosureButtonItemProps,
	DropdownDisclosureDescriptionItemProps,
	DropdownDisclosureLabelItemProps,
	DropdownDisclosureLinkItemProps,
	DropdownDisclosureListItemProps,
}
