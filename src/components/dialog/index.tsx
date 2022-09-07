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

export default function Dialog({
	children,
	isOpen,
	onDismiss,
	label,
	variant = 'modal',
}: DialogProps) {
	const shouldReduceMotion = useReducedMotion()

	const overlayMotionProps =
		variant === 'bottom'
			? {}
			: {
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					initial: { opacity: 0 },
					transition: { duration: shouldReduceMotion ? 0 : 0.3 },
			  }

	const contentWrapperMotionProps =
		variant === 'bottom'
			? {
					animate: { translateY: '1%' },
					exit: { translateY: '100%' },
					initial: { translateY: '100%' },
					transition: { duration: shouldReduceMotion ? 0 : 0.3 },
			  }
			: {}

	return (
		<AnimatePresence>
			{isOpen && (
				<DialogOverlay
					key="overlay"
					className={classNames(s.animatedDialogOverlay, s[variant])}
					isOpen={isOpen}
					onDismiss={onDismiss}
					{...overlayMotionProps}
				>
					<slimMotion.div
						key="contentWrapper"
						className={classNames(s.contentWrapper, s[variant])}
						{...contentWrapperMotionProps}
					>
						<DialogContent
							className={classNames(s.content, s[variant])}
							aria-label={label}
						>
							{children}
						</DialogContent>
					</slimMotion.div>
				</DialogOverlay>
			)}
		</AnimatePresence>
	)
}
