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
} from 'react'
import { useRouter } from 'next/router'
import EmbedElement from 'components/lab-embed/embed-element'
import Resizable from 'components/lab-embed/resizable'
import { trackTerminalEvent, TERMINAL_EVENT } from 'lib/posthog-events'

interface InstruqtContextProps {
	labId: string
	active: boolean
	setActive: Dispatch<SetStateAction<boolean>>
}

interface InstruqtProviderProps {
	labId: string
	children: ReactNode
}

const InstruqtContext = createContext<Partial<InstruqtContextProps>>({})
InstruqtContext.displayName = 'InstruqtContext'

export const useInstruqtEmbed = (): Partial<InstruqtContextProps> =>
	useContext(InstruqtContext)

export default function InstruqtProvider({
	labId,
	children,
}: InstruqtProviderProps): JSX.Element {
	const [active, setActive] = useState(false)
	const router = useRouter()

	useEffect(() => {
		// Track when a sandbox is open or closed
		if (active && labId) {
			trackTerminalEvent(TERMINAL_EVENT.TERMINAL_OPEN, {
				labId,
				page: router.asPath,
			})
		} else if (!active && labId) {
			trackTerminalEvent(TERMINAL_EVENT.TERMINAL_CLOSED, {
				labId,
				page: router.asPath,
			})
		}
	}, [router.asPath, active, labId])

	return (
		<InstruqtContext.Provider value={{ labId, active, setActive }}>
			{children}
			{active && (
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
