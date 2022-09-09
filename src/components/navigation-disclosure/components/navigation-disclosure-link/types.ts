type NativeAProps = JSX.IntrinsicElements['a']

interface NavigationDisclosureLinkProps {
	/**
	 * Content to render within the `<a>` element.
	 */
	children: NativeAProps['children']

	/**
	 * Optional class name to append to the list of classes passed to the
	 * internally rendered `<a>` element.
	 */
	className?: NativeAProps['className']

	/**
	 * Where the user should be navigated when the `<a>` element is activated.
	 */
	href: NativeAProps['href']

	/**
	 * Whether or `href` is the current page or a subpage of the browser URL.
	 */
	isActive: boolean

	/**
	 * Optional [rel](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel) attribute
	 * to be passed to the internal anchor element.
	 */
	rel?: NativeAProps['rel']
}

export type { NavigationDisclosureLinkProps }
