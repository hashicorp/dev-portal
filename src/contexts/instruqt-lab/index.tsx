/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	useState,
	createContext,
	useContext,
	ReactNode,
	Dispatch,
	SetStateAction,
	useEffect,
	useCallback,
} from 'react'
import dynamic from 'next/dynamic'
import EmbedElement from 'components/lab-embed/embed-element'
import Resizable from 'components/lab-embed/resizable'

interface InstruqtContextProps {
	labId: string | null
	active: boolean
	setActive: Dispatch<SetStateAction<boolean>>
	openLab: (labId: string) => void
	closeLab: () => void
}

interface InstruqtProviderProps {
	children?: ReactNode
}

const STORAGE_KEY = 'instruqt-lab-state'

const InstruqtContext = createContext<InstruqtContextProps>({
	labId: null,
	active: false,
	setActive: () => {},
	openLab: () => {},
	closeLab: () => {},
})
InstruqtContext.displayName = 'InstruqtContext'

export const useInstruqtEmbed = (): InstruqtContextProps =>
	useContext(InstruqtContext)

function InstruqtProvider({ children }: InstruqtProviderProps): JSX.Element {
	const [isClient, setIsClient] = useState(false)
	const [labId, setLabId] = useState<string | null>(null)
	const [active, setActive] = useState(false)

	// Only run on client side
	useEffect(() => {
		setIsClient(true)
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				const { active: storedActive, storedLabId } = JSON.parse(stored)
				setLabId(storedLabId)
				setActive(storedActive)
			}
		} catch (e) {
			console.warn('Failed to restore Instruqt lab state:', e)
		}
	}, [])

	// Persist state changes to localStorage
	useEffect(() => {
		if (!isClient) return

		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					active,
					storedLabId: labId,
				})
			)
		} catch (e) {
			console.warn('Failed to persist Instruqt lab state:', e)
		}
	}, [active, labId, isClient])

	const openLab = useCallback((newLabId: string) => {
		setLabId(newLabId)
		setActive(true)
	}, [])

	const closeLab = useCallback(() => {
		setActive(false)
	}, [])

	return (
		<InstruqtContext.Provider
			value={{ labId, active, setActive, openLab, closeLab }}
		>
			{children}
			{isClient && active && labId && (
				<div id="instruqt-panel-target">
					<Resizable
						initialHeight={640}
						panelActive={active}
						setPanelActive={setActive}
						style={{ top: '-28px' }}
					>
						<EmbedElement />
					</Resizable>
				</div>
			)}
		</InstruqtContext.Provider>
	)
}

// Export a client-side only version of the provider
export default dynamic(() => Promise.resolve(InstruqtProvider), {
	ssr: false,
})
