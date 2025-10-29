/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	useState,
	useEffect,
	useRef,
	Dispatch,
	SetStateAction,
	useCallback,
} from 'react'
import CSS from 'csstype'
import classNames from 'classnames'
import Resizer from './components/resizer'
import s from './resizable.module.css'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'

interface ResizableProps {
	panelActive: boolean
	children: React.ReactNode
	setPanelActive: Dispatch<SetStateAction<boolean>>
	initialHeight: number
	style: CSS.Properties
}

export default function Resizable({
	panelActive,
	setPanelActive,
	children,
	style,
	initialHeight = 400,
}: ResizableProps) {
	const { closeLab } = useInstruqtEmbed()

	const minimumHeight = 300
	const maximumHeight = 910
	const [downMouseY, setDownMouseY] = useState(0)
	const [moveMouseY, setMoveMouseY] = useState(0)
	const [height, setHeight] = useState(initialHeight)
	const [previousHeight, setPreviousHeight] = useState(initialHeight)
	const [isResizing, setIsResizing] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	const resizableDiv = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 1024)
		}

		checkIsMobile()
		window.addEventListener('resize', checkIsMobile)

		return () => window.removeEventListener('resize', checkIsMobile)
	}, [])

	// Handle ESC key to close panel
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && panelActive) {
				closeLab()
			}
		}

		if (panelActive) {
			document.addEventListener('keydown', handleKeyDown)
		}

		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [panelActive, closeLab])

	useEffect(() => {
		if (resizableDiv.current && !isMobile) {
			const newHeight = previousHeight - (moveMouseY - downMouseY)
			if (maximumHeight > newHeight && newHeight > minimumHeight) {
				setHeight(newHeight)
			}
		}
	}, [moveMouseY, downMouseY, previousHeight, isMobile])

	const resize = useCallback(
		(e: MouseEvent) => {
			if (isMobile) return

			setMoveMouseY(e.clientY)
		},
		[isMobile]
	)

	const stopResize = useCallback(() => {
		setIsResizing(false)
		document.body.style.userSelect = ''
		window.removeEventListener('mousemove', resize)
		window.removeEventListener('mouseup', stopResize)
		window.removeEventListener('blur', stopResize)
	}, [resize])

	const enableResize = useCallback(
		(e: React.MouseEvent) => {
			if (isMobile) return // Disable resizing on mobile

			e.preventDefault()
			setDownMouseY(e.clientY)
			setPreviousHeight(height)
			setIsResizing(true)

			// prevent text selection while dragging
			document.body.style.userSelect = 'none'

			// Add event listeners to window immediately
			window.addEventListener('mousemove', resize, { passive: true })
			window.addEventListener('mouseup', stopResize, { passive: true })
			window.addEventListener('blur', stopResize)
		},
		[isMobile, height, resize, stopResize]
	)

	// Cleanup effect to ensure event listeners are removed
	useEffect(() => {
		return () => {
			document.body.style.userSelect = ''
			window.removeEventListener('mousemove', resize)
			window.removeEventListener('mouseup', stopResize)
			window.removeEventListener('blur', stopResize)
		}
	}, [resize, stopResize])

	return (
		<div
			className={classNames(
				s.resizable,
				{ [s.resizing]: isResizing },
				{ [s.hide]: !panelActive },
				{ [s.mobile]: isMobile }
			)}
			ref={resizableDiv}
			style={{
				height: isMobile ? '100vh' : `${height}px`,
			}}
			data-resizing={String(isResizing)}
			role="dialog"
			aria-label="Interactive Lab Environment"
			aria-modal="true"
		>
			{isResizing && (
				<div
					className={s.resizeShield}
					aria-hidden="true"
				/>
			)}
			<Resizer
				onClosePanel={() => closeLab()}
				onMouseDown={enableResize}
				style={style}
				isMobile={isMobile}
			/>
			{children}
		</div>
	)
}
