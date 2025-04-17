/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
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
	// State for resizable panel while in `panel`-mode
	const minimumHeight = 300
	const maximumHeight = 910
	const [downMouseY, setDownMouseY] = useState(0)
	const [moveMouseY, setMoveMouseY] = useState(0)
	const [height, setHeight] = useState(initialHeight)
	const [previousHeight, setPreviousHeight] = useState(initialHeight)
	const [isResizing, setIsResizing] = useState(false)

	const resizableDiv = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (resizableDiv.current) {
			const newHeight = previousHeight - (moveMouseY - downMouseY)
			if (maximumHeight > newHeight && newHeight > minimumHeight) {
				setHeight(newHeight)
			}
		}
	}, [moveMouseY, downMouseY, previousHeight])

	function enableResize(e) {
		e.preventDefault()
		// We need to know where the mouse started from since default state was just 0
		setDownMouseY(e.screenY)
		// Track the fact that we are resizing
		// This keeps our cursor on our `<Resizer/>`
		// This adds a class to the content our mouse may otherwise wander into via `pointer-events: none`
		setIsResizing(true)
		// Once we're clientside add the event listeners needed during a resize
		addListeners()
	}

	function resize(e) {
		setPreviousHeight(height)
		setMoveMouseY(e.screenY)
	}

	function stopResize() {
		// We stopped resizing so it'd be great to be able to use the content inside the resizable ref ;)
		setIsResizing(false)
		// We no longer want our event listeners
		removeListeners()
	}
	// Adds the necessary event listeners during a resize
	function addListeners() {
		window.addEventListener('mousemove', resize)
		window.addEventListener('mouseup', stopResize)
	}
	// Removes resize-related event listeners
	function removeListeners() {
		window.removeEventListener('mousemove', resize)
		window.removeEventListener('mouseup', stopResize)
	}

	return (
		<div
			className={classNames(
				s.resizable,
				{ [s.resizing]: isResizing },
				{ [s.hide]: !panelActive }
			)}
			ref={resizableDiv}
			style={{
				height: `${height}px`,
			}}
			data-resizing={String(isResizing)}
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
