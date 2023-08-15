import Link from 'next/link'
import { IconLink16 } from '@hashicorp/flight-icons/svg-react/link-16'
// Types
import type { PropsWithChildren } from 'react'
// Styles
import s from './content-with-permalink.module.css'

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
