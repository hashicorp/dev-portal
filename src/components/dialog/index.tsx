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
				<AnimatedDialogOverlay
					animate={{ opacity: 1 }}
					className={classNames(s.animatedDialogOverlay, s[variant])}
					exit={{ opacity: variant === 'bottom' ? 1 : 0 }}
					initial={{ opacity: variant === 'bottom' ? 1 : 0 }}
					isOpen={isOpen}
					onDismiss={onDismiss}
					transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
				>
					<slimMotion.div
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
				</AnimatedDialogOverlay>
			)}
		</AnimatePresence>
	)
}
