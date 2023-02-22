import classNames from 'classnames'
import type { OutlineLinkProps } from '../../types'
import s from './outline-link.module.css'

/**
 * Renders an individual outline nav link.
 */
function OutlineLink({
	title,
	url,
	isActive,
	dataHeapTrack,
}: OutlineLinkProps) {
	return (
		<a
			className={classNames(s.root, { [s.isActive]: isActive })}
			href={url}
			data-heap-track={dataHeapTrack}
		>
			{title}
		</a>
	)
}

export { OutlineLink }
