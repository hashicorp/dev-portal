import Link from 'next/link'
import { IconLink16 } from '@hashicorp/flight-icons/svg-react/link-16'
// Types
import type { PropsWithChildren } from 'react'
// Styles
import s from './content-with-permalink.module.css'

/**
 * Renders the provided `children` alongside a permalink `<a />` element.
 *
 * `ariaLabel` is required to ensure the permalink element has meaningful
 * text for screen readers. For simple use cases where `children` is a
 * string, the `ariaLabel` can be passed the same value as `children`.
 * For more complex use cases, the consumer should determine what text
 * would be appropriate to pass to `ariaLabel`.
 *
 * Note that this component does _not_ handle placing the provided `id`
 * in the DOM. It requires the consumer to place the `id` on an appropriate
 * element, typically an element rendered in the provided `children`.
 */
export function ContentWithPermalink({
	id,
	ariaLabel,
	children,
}: PropsWithChildren<{ id: string; className?: string; ariaLabel: string }>) {
	return (
		<div className={s.root}>
			{children}
			<Link className={s.permalink} aria-label={ariaLabel} href={`#${id}`}>
				<IconLink16 className={s.permalinkIcon} />
			</Link>
		</div>
	)
}
