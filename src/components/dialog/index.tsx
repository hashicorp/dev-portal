/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
import { useEffect, useState } from 'react'

const AnimatedDialogOverlay = slimMotion(DialogOverlay)

const overlayVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
	},
}

export default function Dialog({
	ariaDescribedBy,
	children,
	contentClassName,
	isOpen,
	label,
	onDismiss,
	variant = 'modal',
}: DialogProps) {
	const shouldReduceMotion = useReducedMotion()
	const [padding, setPadding] = useState('0px')

	const overlayMotionProps = {
		variants: overlayVariants,
		animate: 'show',
		initial: 'hidden',
		exit: 'hidden',
		transition: { duration: shouldReduceMotion ? 0 : 0.3 },
	}

	useEffect(() => {
		const handleResize = () => {
			setPadding(
				(window.innerHeight - window.visualViewport.height).toString() + 'px'
			)
		}

		window.visualViewport.addEventListener('resize', handleResize)

		return () =>
			window.visualViewport.removeEventListener('resize', handleResize)
	}, [])

	return (
		<AnimatePresence>
			{isOpen && (
				<AnimatedDialogOverlay
					key="overlay"
					className={classNames(s.animatedDialogOverlay, s[variant])}
					isOpen={isOpen}
					onDismiss={onDismiss}
					{...overlayMotionProps}
				>
					<div
						key="contentWrapper"
						className={classNames(s.contentWrapper, s[variant])}
						style={
							variant === 'bottom'
								? { paddingBottom: padding }
								: { paddingBottom: '0px' }
						}
					>
						<DialogContent
							aria-describedby={ariaDescribedBy}
							aria-label={label}
							className={classNames(s.content, s[variant], contentClassName)}
						>
							{children}
						</DialogContent>
					</div>
				</AnimatedDialogOverlay>
			)}
		</AnimatePresence>
	)
}
