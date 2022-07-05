import { LinkProps } from 'next/link'
import { TextProps } from 'components/text'

type NativeAnchorProps = JSX.IntrinsicElements['a']

export interface InlineLinkProps {
	/**
	 * The content to render within the `<a>` element.
	 */
	children: NativeAnchorProps['children']

	/**
	 * A string of one or more class names. Applied last to the rendered `<a>`
	 * element.
	 */
	className?: NativeAnchorProps['className']

	/**
	 * The destination of the link.
	 */
	href: LinkProps['href']

	/**
	 * The `size` used to apply a `hds-typography-body-` CSS helper class.
	 */
	textSize?: TextProps['size']

	/**
	 * The `weight` used to apply a `hds-font-weight-` CSS helper class.
	 */
	textWeight?: TextProps['weight']
}
