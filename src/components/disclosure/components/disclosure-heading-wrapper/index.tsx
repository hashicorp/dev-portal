import { DisclosureHeadingWrapperProps } from './types'
import s from './disclosure-heading-wrapper.module.css'

/**
 * Component that wraps DisclosureActivator with a heading of the
 * specified level, or React.Fragment if no level is provided.
 *
 * This is intended for use in establishing semantic meaning for the disclosure
 * section, particularly when used in an Accordion design pattern. Ref:
 * https://www.w3.org/WAI/ARIA/apg/example-index/accordion/accordion.html
 *
 * Note: we're opting not to use `components/heading` here, as for this
 * case, we want to wrap elements in <h{n} /> without adding any styles
 * at all, leaving the styling up to the provided `children`.
 */
function DisclosureHeadingWrapper({
	children,
	level,
}: DisclosureHeadingWrapperProps) {
	if (typeof level === 'undefined') {
		return <>{children}</>
	} else {
		const Heading = level as React.ElementType
		return <Heading className={s.headingMarginReset}>{children}</Heading>
	}
}

export default DisclosureHeadingWrapper
