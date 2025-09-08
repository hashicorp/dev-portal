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

			setMoveMouseY(e.screenY)
		},
		[isMobile]
	)

	const stopResize = useCallback(() => {
		setIsResizing(false)
		window.removeEventListener('mousemove', resize)
		window.removeEventListener('mouseup', stopResize)
	}, [resize])

	const addListeners = useCallback(() => {
		window.addEventListener('mousemove', resize, { passive: true })
		window.addEventListener('mouseup', stopResize, { passive: true })
	}, [resize, stopResize])

	const removeListeners = useCallback(() => {
		window.removeEventListener('mousemove', resize)
		window.removeEventListener('mouseup', stopResize)
	}, [resize, stopResize])

	const enableResize = useCallback(
		(e: React.MouseEvent) => {
			if (isMobile) return // Disable resizing on mobile

			e.preventDefault()
			setDownMouseY(e.screenY)
			setPreviousHeight(height)
			setIsResizing(true)
			addListeners()
		},
		[isMobile, height, addListeners]
	)

	useEffect(() => {
		return () => {
			removeListeners()
		}
	}, [removeListeners])

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
			<Resizer
				onClosePanel={() => closeLab()}
				onMouseDown={enableResize}
				style={style}
			/>
			{children}
		</div>
	)
}
