import { ReactNode } from 'react'
import { HeadingLevel } from './types'
import s from './heading-wrapper.module.css'

/**
 * Given a heading level,
 * Return a heading component at that level that will wrap children
 * without adding styles.
 *
 * Note: we're opting not to use `components/heading` here, as for this
 * case, we want to wrap elements in <h{n} /> without adding any styles
 * at all, leaving the styling up to the provided `children`.
 */
export function getHeadingWrapper(level: HeadingLevel) {
	const Heading = level as React.ElementType
	// eslint-disable-next-line react/display-name
	return ({ children }: { children: ReactNode }) => (
		<Heading className={s.headingMarginReset}>{children}</Heading>
	)
}
