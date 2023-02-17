import classNames from 'classnames'
import type { OutlineLinkProps } from '../../types'
import s from './outline-link.module.css'

/**
 * Renders an individual outline nav link.
 */
function OutlineLink({ title, url, isActive }: OutlineLinkProps) {
	return (
		<a
			className={classNames(s.root, { [s.isActive]: isActive })}
			href={url}
			/* TODO: confirm specifics for data-heap-track here, if we want it */
			data-heap-track="outline-nav-link"
		>
			{title}
		</a>
	)
}

export { OutlineLink }
