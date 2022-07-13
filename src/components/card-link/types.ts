import { CardProps } from 'components/card/types'

type NativeAnchorProps = JSX.IntrinsicElements['a']

export interface CardLinkProps {
	/**
	 * An optional string value that labels the link. For use when content visible
	 * in the DOM meant to give the link meaning is either missing, or does not
	 * accurately describe the link.
	 */
	ariaLabel?: NativeAnchorProps['aria-label']

	/**
	 * The content to render within the `CardLink` body. Passed to the inner
	 * `Card` component.
	 */
	children: CardProps['children']

	/**
	 * A string of one or more classnames passed to the inner `Card` component.
	 */
	className?: NativeAnchorProps['className']

	/**
	 * The destination of the link.
	 */
	href: NativeAnchorProps['href']

	/**
	 * Whether or not the given link should open in a new tab.
	 */
	openInNewTab?: boolean
}
