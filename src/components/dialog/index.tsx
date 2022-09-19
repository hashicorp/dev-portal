import classNames from 'classnames'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
	AnimatePresence,
	m as slimMotion,
	useReducedMotion,
} from 'framer-motion'
import { DialogProps } from './types'
import s from './dialog.module.css'

const AnimatedDialogOverlay = slimMotion(DialogOverlay)

export default function Dialog({
	children,
	contentClassName,
	isOpen,
	label,
	onDismiss,
}: DialogProps) {
	const shouldReduceMotion = useReducedMotion()

	return (
		<AnimatePresence>
			{isOpen && (
				<AnimatedDialogOverlay
					animate={{ opacity: 1 }}
					className={s.animatedDialogOverlay}
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					isOpen={isOpen}
					onDismiss={onDismiss}
					transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
				>
					<div className={s.contentWrapper}>
						<DialogContent
							className={classNames(s.content, contentClassName)}
							aria-label={label}
						>
							{children}
						</DialogContent>
					</div>
				</AnimatedDialogOverlay>
			)}
		</AnimatePresence>
	)
}
