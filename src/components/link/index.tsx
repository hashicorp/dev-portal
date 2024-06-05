/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import NextLink from 'next/link'
import { useId } from '@react-aria/utils'
import { LinkProps } from './types'
import { validateProps } from './helpers'

const ARIA_DESCRIBED_BY_PREFIX = 'opens-in-new-tab-label'

/**
 * A wrapper for the next/link component that also handles unique functionality
 * with the `opensInNewTab` prop.
 *
 * When `opensInNewTab` is passed, a `<span>` with the `g-screen-reader-only`
 * class is rendered with "(opens in new tab)" as its inner text. This approach
 * is inspired by WCAG 2.1 Technique G201: Giving users advanced warning when
 * opening a new window.
 *
 * https://www.w3.org/WAI/WCAG21/Techniques/general/G201
 */
const Link = ({ children, href, opensInNewTab, ...restProps }: LinkProps) => {
	validateProps({ opensInNewTab, target: restProps.target })

	const uniqueId = useId()
	const opensInNewTabLabelId = `${ARIA_DESCRIBED_BY_PREFIX}-${uniqueId}`
	const shouldRenderScreenReaderOnlyMessage =
		opensInNewTab === true || restProps.target === '_blank'

	/**
	 * Generate the final link's `target` prop.
	 */
	const target = opensInNewTab ? '_blank' : restProps.target

	/**
	 * Generate the final link's `aria-describedby` prop.
	 */
	let ariaDescribedBy: LinkProps['aria-describedby']
	if (shouldRenderScreenReaderOnlyMessage) {
		ariaDescribedBy = opensInNewTabLabelId
	}

	if (restProps['aria-describedby']?.length > 0) {
		ariaDescribedBy = !ariaDescribedBy
			? restProps['aria-describedby']
			: `${ariaDescribedBy} ${restProps['aria-describedby']}`
	}

	return (
		<>
			<NextLink
				href={href}
				{...restProps}
				aria-describedby={ariaDescribedBy}
				target={target}
			>
				{children}
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
