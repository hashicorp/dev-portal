import NextLink from 'next/link'
import { useId } from '@react-aria/utils'
import { LinkProps } from './types'

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

	/**
	 * Generate the `target` prop.
	 */
	let target: LinkProps['target']
	if (restProps.target) {
		target = restProps.target
	} else if (opensInNewTab) {
		target = '_blank'
	}

	/**
	 * Generate the `aria-describedby` prop.
	 */
	let ariaDescribedBy: LinkProps['aria-describedby']
	if (opensInNewTab) {
		ariaDescribedBy += opensInNewTabLabelId
	}
	if (restProps['aria-describedby']?.length > 0) {
		ariaDescribedBy += ` ${restProps['aria-describedby']}`
	}

	return (
		<NextLink href={href} {...nextLinkProps}>
			{opensInNewTab ? (
				<span className="g-screen-reader-only" id={opensInNewTabLabelId}>
					(opens in new tab)
				</span>
			) : null}
			<a {...restProps} aria-describedby={ariaDescribedBy} target={target}>
				{children}
			</a>
		</NextLink>
	)
}

export type { LinkProps }
export default Link
