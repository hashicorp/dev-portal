import NextLink from 'next/link'
import { useId } from '@react-aria/utils'
import { LinkProps } from './types'
import { developmentToast, ToastColor } from 'components/toast'

const ARIA_DESCRIBED_BY_PREFIX = 'opens-in-new-tab-label'

/**
 * A wrapper for the next/link component that also handles unique functionality
 * with the `opensInNewTab` prop.
 *
 * When `opensInNewTab` is passed, a `<span>` with the `g-screen-reader-only`
 * class is rendered with "(opens in new tab)" as its inner text. This approach
 * is inspired by WCAG 2.1 Ttechnique G201: Giving users advanced warning when
 * opening a new window.
 *
 * https://www.w3.org/WAI/WCAG21/Techniques/general/G201
 */
const Link = ({
	children,
	href,
	nextLinkProps,
	opensInNewTab,
	...restProps
}: LinkProps) => {
	const uniqueId = useId()
	const opensInNewTabLabelId = `${ARIA_DESCRIBED_BY_PREFIX}-${uniqueId}`
	const shouldRenderScreenReaderOnlyMessage =
		opensInNewTab === true || restProps.target === '_blank'

	/**
	 * Check if `target="_blank"` is used rather than `opensInNewTab`.
	 *
	 * @NOTE While the component successfully handles when `target="_blank"`,
	 * using the `opensInNewTab` prop can lower the cognitive load of reading and
	 * writing a reference to this component that opens a link in a new tab.
	 *
	 * This code requires 1) the reader to know what target="_blank" does and 2)
	 * the writer to recall the exact property name and value:
	 *
	 *    <Link {...otherProps} target="_blank" />
	 *
	 * This code does not require 1) the reader to know what target="_blank" does
	 * and 2) the writer to recall the exact property name and value (just a the
	 * name of the property that has a more intuitive name than `target`):
	 *
	 *    <Link {...otherProps} opensInNewTab />
	 *
	 */
	if (opensInNewTab !== true && restProps.target === '_blank') {
		developmentToast({
			color: ToastColor.warning,
			title: 'Warning in src/components/Link',
			description:
				'`target="_blank"` was used instead of the `opensInNewTab` prop.',
		})
	}

	/**
	 * Generate the `target` prop.
	 *
	 * @NOTE The `opensInNewTab` prop takes precedence over the `target` prop.
	 * This is because the `opensInNewTab` prop renders a screen-reader-only label
	 * when `true`. If both `opensInNewTab` and `target` were passed, and `target`
	 * did not have the value of `"_blank"`, then the screen-reader-only label
	 * would not be accurate.
	 */
	const target = opensInNewTab ? '_blank' : restProps.target
	if (opensInNewTab && !!restProps.target) {
		developmentToast({
			color: ToastColor.critical,
			title: 'Error in src/components/Link',
			description:
				'Both `opensInNewTab` and `target` were passed. Only pass one or the other.',
		})
	}

	/**
	 * Generate the `aria-describedby` prop.
	 */
	let ariaDescribedBy: LinkProps['aria-describedby']
	if (shouldRenderScreenReaderOnlyMessage) {
		ariaDescribedBy += opensInNewTabLabelId
	}
	if (restProps['aria-describedby']?.length > 0) {
		ariaDescribedBy += ` ${restProps['aria-describedby']}`
	}

	return (
		<>
			<NextLink href={href} {...nextLinkProps}>
				<a {...restProps} aria-describedby={ariaDescribedBy} target={target}>
					{children}
				</a>
			</NextLink>
			{shouldRenderScreenReaderOnlyMessage ? (
				<span className="g-screen-reader-only" id={opensInNewTabLabelId}>
					(opens in new tab)
				</span>
			) : null}
		</>
	)
}

export type { LinkProps }
export default Link
