import {
	createContext,
	useState,
	useContext,
	useMemo,
	ReactNode,
	Dispatch,
	SetStateAction,
} from 'react'

type TabContextValue = {
	activeTabGroup?: string
	setActiveTabGroup?: Dispatch<SetStateAction<string>>
}

export function useTabGroups(): TabContextValue {
	const context = useContext(TabContext)
	if (context === undefined) {
		throw new Error('useTabGroups must be used within a TabProvider')
	}

	return context
}

const TabContext = createContext(undefined)

export default function TabProvider({ children }: { children: ReactNode }) {
	const [activeTabGroup, setActiveTabGroup] = useState<string>()
	const contextValue = useMemo(
		() => ({ activeTabGroup, setActiveTabGroup }),
		[activeTabGroup]
	)

	return (
		<TabContext.Provider value={contextValue}>{children}</TabContext.Provider>
	)
}
