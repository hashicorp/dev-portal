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
	return useContext(TabContext)
}

const TabContext = createContext(undefined)
TabContext.displayName = 'TabContext'

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
