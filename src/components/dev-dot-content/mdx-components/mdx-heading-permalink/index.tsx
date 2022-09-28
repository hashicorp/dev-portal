import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { IconDuplicate16 } from '@hashicorp/flight-icons/svg-react/duplicate-16'
import { IconCheckSquare16 } from '@hashicorp/flight-icons/svg-react/check-square-16'
import s from './mdx-heading-permalink.module.css'

export default function MdxHeadingPermalink(props) {
	const [copiedState, setCopiedState] = useState<boolean | null>(null)
	const [resetTimeout, setResetTimeout] = useState<number>()

	const { className, href, ...rest } = props

	// After displaying feedback on the success state,
	// reset to the default appearance so that it's clear
	// the "Copy" button can be used again
	useEffect(() => {
		// Clear any pending timeouts, which can occur if the
		// button is quickly clicked multiple times
		window.clearTimeout(resetTimeout)

		// Only run the copiedState reset if it's needed
		const needsReset = copiedState != null
		if (needsReset) {
			// Let failure messages linger a bit longer
			const resetDelay = copiedState == false ? 4000 : 1750
			// Set the timeout to reset the copy success state
			setResetTimeout(window.setTimeout(() => setCopiedState(null), resetDelay))
		}

		// Clean up if the component unmounts with a pending timeout
		return () => clearTimeout(resetTimeout)
	}, [copiedState])

	function copyLinkToClipboard(e) {
		navigator.clipboard.writeText(href).then(
			() => {
				console.log(`Successfully copied ${href} to clipboard`)
				setCopiedState(true)
			},
			() => {
				console.error(`Error copying ${href} to clipboard`)
			}
		)
	}

	return (
		<button
			className={classNames(s.root, className)}
			{...rest}
			onClick={copyLinkToClipboard}
		>
			<div className={s.icon}>
				{copiedState ? (
					<IconCheckSquare16 color="var(--token-color-foreground-action)" />
				) : (
					<IconDuplicate16 color="var(--token-color-foreground-faint)" />
				)}
			</div>
		</button>
	)
}
