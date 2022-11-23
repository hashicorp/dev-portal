import { CardProps } from 'components/card/types'

type NativeAnchorProps = JSX.IntrinsicElements['a']

export interface CardLinkProps {
	/**
	 * The text used as the `CardLink`'s accessible label. Required so the element
	 * is announced by screen readers.
	 */
	ariaLabel: NativeAnchorProps['aria-label']

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

	/**
	 * An optional data-heap-track string to place on the `<a />` element.
	 */
	'data-heap-track'?: string
}
