import { ReactNode } from 'react'
import { HeadingLevel } from './types'
import s from './heading-wrapper.module.css'

/**
 * Given a heading level,
 * Return a heading component at that level that will wrap children
 * without adding styles.
 */
export function getHeadingWrapper(level: HeadingLevel) {
	const Heading = level as React.ElementType
	// eslint-disable-next-line react/display-name
	return ({ children }: { children: ReactNode }) => (
		<Heading className={s.headingMarginReset}>{children}</Heading>
	)
}
