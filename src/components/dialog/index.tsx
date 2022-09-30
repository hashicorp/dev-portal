import { useRef } from 'react'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
	AnimatePresence,
	m as slimMotion,
	useReducedMotion,
} from 'framer-motion'
import classNames from 'classnames'
import { DialogProps } from './types'
import s from './dialog.module.css'

const AnimatedDialogOverlay = slimMotion(DialogOverlay)

const overlayVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
	},
}

export default function Dialog({
	children,
	contentClassName,
	isOpen,
	label,
	onDismiss,
	variant = 'modal',
}: DialogProps) {
	const dialogRef = useRef()
	const shouldReduceMotion = useReducedMotion()

	const overlayMotionProps = {
		variants: overlayVariants,
		animate: 'show',
		initial: 'hidden',
		exit: 'hidden',
		transition: { duration: shouldReduceMotion ? 0 : 0.3 },
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<AnimatedDialogOverlay
					key="overlay"
					className={classNames(s.animatedDialogOverlay, s[variant])}
					isOpen={isOpen}
					onDismiss={onDismiss}
					initialFocusRef={dialogRef}
					{...overlayMotionProps}
				>
					<div
						key="contentWrapper"
						className={classNames(s.contentWrapper, s[variant])}
					>
						<DialogContent
							aria-label={label}
							className={classNames(s.content, s[variant], contentClassName)}
							ref={dialogRef}
						>
							{children}
						</DialogContent>
					</div>
				</AnimatedDialogOverlay>
			)}
		</AnimatePresence>
	)
}
