import { ReactNode } from 'react'
import s from './sidecar-scroll-container.module.css'

/**
 * Renders a scrollable container intended for sidecar contents,
 * with a gradient scrim at the bottom of the container.
 */
function SidecarScrollContainer({ children }: { children: ReactNode }) {
	return (
		<div className={s.root}>
			<div className={s.scrollContainer}>{children}</div>
		</div>
	)
}

export { SidecarScrollContainer }
