import {
	type MutableRefObject,
	type MouseEvent,
	type KeyboardEvent,
	createContext,
	useContext,
} from 'react'

interface TabsContextState {
	tabNodes: MutableRefObject<Array<HTMLButtonElement>>
	panelNodes: MutableRefObject<Array<HTMLDivElement>>
	tabIds: Array<string>
	panelIds: Array<string>
	selectedTabIndex: number
	onClick: (tabIndex: number, event: MouseEvent<HTMLButtonElement>) => void
	onKeyUp: (tabIndex: number, event: KeyboardEvent<HTMLButtonElement>) => void
	size: 'medium' | 'large'
	tabsListRef: MutableRefObject<HTMLUListElement | null>
}

export const TabsContext = createContext<TabsContextState | undefined>(
	undefined
)

export function useTabsContext(): TabsContextState {
	const context = useContext(TabsContext)
	if (context === undefined) {
		throw new Error('useTabsContext must be used within a TabsContext.Provider')
	}
	return context
}
