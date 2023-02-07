import {
	createContext,
	useState,
	useContext,
	useMemo,
	ReactNode,
	useCallback,
} from 'react'
import { useRouter } from 'next/router'
import {
	getTabGroupQueryParam,
	setTabGroupQueryParam,
} from './helpers/get-set-tab-group-query-param'

type TabContextValue = {
	activeTabGroup?: string
	setActiveTabGroup?: (newValue: string, isNested: boolean) => void
}

export function useTabGroups(): TabContextValue {
	return useContext(TabContext)
}

const TabContext = createContext(undefined)
TabContext.displayName = 'TabContext'

export default function TabProvider({ children }: { children: ReactNode }) {
	const router = useRouter()
	const tabGroupParam = getTabGroupQueryParam()
	const [activeTabGroup, _setActiveTabGroup] = useState<string>(tabGroupParam)

	const setActiveTabGroup = useCallback(
		(newActiveTabGroup: string, isNested: boolean) => {
			// Don't do anything if the tab group isn't changing
			if (newActiveTabGroup === activeTabGroup) {
				return
			}

			// Set the active tab group in the local state
			_setActiveTabGroup(newActiveTabGroup)

			// If the Tab isn't nested, update the tabGroup query string param
			if (!isNested) {
				setTabGroupQueryParam({ newValue: newActiveTabGroup, router })
			}
		},
		[activeTabGroup, router]
	)

	const contextValue = useMemo(
		() => ({ activeTabGroup, setActiveTabGroup }),
		[activeTabGroup, setActiveTabGroup]
	)
	return (
		<TabContext.Provider value={contextValue}>{children}</TabContext.Provider>
	)
}
