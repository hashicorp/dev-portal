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
} from 'react'
import EmbedElement from 'components/lab-embed/embed-element'
import Resizable from 'components/lab-embed/resizable'

interface InstruqtContextProps {
	labId: string
	active: boolean
	setActive: Dispatch<SetStateAction<boolean>>
}

interface InstruqtProviderProps {
	labId: string
	children: ReactNode
	defaultActive?: boolean
}

const InstruqtContext = createContext<Partial<InstruqtContextProps>>({})
InstruqtContext.displayName = 'InstruqtContext'

export const useInstruqtEmbed = (): Partial<InstruqtContextProps> =>
	useContext(InstruqtContext)

export default function InstruqtProvider({
	labId,
	children,
	defaultActive = false,
}: InstruqtProviderProps): JSX.Element {
	const [active, setActive] = useState(defaultActive)

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
