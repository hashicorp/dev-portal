import { useState, useEffect } from 'react'
import { IconClipboardCopy16 } from '@hashicorp/flight-icons/svg-react/clipboard-copy-16'
import { IconClipboardChecked16 } from '@hashicorp/flight-icons/svg-react/clipboard-checked-16'
import { IconClipboardX16 } from '@hashicorp/flight-icons/svg-react/clipboard-x-16'

import cn from 'classnames'
import s from './copy-snippet.module.css'

interface CopySnippetProps {
	/**
	 * @default primary
	 */
	color?: 'primary' | 'secondary'
	/**
	 * Indicates that the component should take up the full width of the parent container.
	 * @default false
	 */
	isFullWidth?: boolean
	/** String value or action that returns a string to be copied. */
	textToCopy: string
	/**
	 * Selector string or element object of containing element, typically used in conjunction with modals; set the focused element as the container value.
	 */
	container?: string
	/**
	 * Constrains text to one line and truncates it based on available width. Text will only be truncated if it does not fit within the available space.
	 *
	 * @default false
	 */
	isTruncated?: boolean
}

/**
 * @see https://helios.hashicorp.design/components/copy/snippet
 */
export default function CopySnippet({
	textToCopy,
	color = 'primary',
	isFullWidth = false,
	isTruncated = false,
}: CopySnippetProps) {
	// note: error exists in the original HDS css but
	// is not yet used in this component
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

	const handleClick = () => {
		setStatus('success')
		navigator.clipboard.writeText(textToCopy)
	}
	useEffect(() => {
		if (status !== 'idle') {
			const timeout = setTimeout(() => {
				setStatus('idle')
			}, 3000)
			return () => {
				clearTimeout(timeout)
			}
		}
	}, [status])

	return (
		<button
			className={cn(s['hds-copy-snippet'], {
				[s['hds-copy-snippet--color-primary']]: color === 'primary',
				[s['hds-copy-snippet--color-secondary']]: color === 'secondary',
				[s['hds-copy-snippet--width-full']]: isFullWidth,
				[s['hds-copy-snippet--status-success']]: status === 'success',
				[s['hds-copy-snippet--status-error']]: status === 'error',
			})}
			type="button"
			onClick={handleClick}
		>
			<span
				className={cn(
					s['hds-copy-snippet__text'],
					'hds-typography-code-100', // global
					{
						[s['hds-copy-snippet__text--truncated']]: isTruncated,
					}
				)}
			>
				{textToCopy}
			</span>
			{status == 'idle' && (
				<IconClipboardCopy16 className={s['hds-copy-snippet__icon']} />
			)}
			{status == 'success' && (
				<IconClipboardChecked16 className={s['hds-copy-snippet__icon']} />
			)}
			{status == 'error' && (
				<IconClipboardX16 className={s['hds-copy-snippet__icon']} />
			)}
		</button>
	)
}
