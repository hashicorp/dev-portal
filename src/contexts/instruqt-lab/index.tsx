import {
	useState,
	createContext,
	useContext,
	ReactNode,
	Dispatch,
	SetStateAction,
	useEffect,
} from 'react'
import EmbedElement from 'components/lab-embed/embed-element'
import Resizable from 'components/lab-embed/resizable'
import { trackInstruqtEvent } from './track-instruqt-event'

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

	useEffect(() => {
		const handler = (e) => trackInstruqtEvent(e, { labId })

		if (active) {
			// If active, listen for & track events from Instruqt
			window.addEventListener('message', handler, true)
		}
		return () => {
			window.removeEventListener('message', handler as EventListener)
		}
	}, [active, labId])

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
