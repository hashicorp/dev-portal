import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react'

const GLOBAL_SEARCH_ENABLED = __config.flags.enable_global_search

interface GlobalSearchContextValue {
	isGlobalSearchEnabled: boolean
	searchIsOpen: boolean
	toggleSearchIsOpen: () => void
}

interface GlobalSearchProviderProps {
	children: ReactNode
}

const GlobalSearchContext = createContext<GlobalSearchContextValue>(undefined)

const GlobalSearchProvider = ({ children }: GlobalSearchProviderProps) => {
	const isGlobalSearchEnabled = GLOBAL_SEARCH_ENABLED
	const [searchIsOpen, setSearchIsOpen] = useState<boolean>(false)
	const toggleSearchIsOpen = useCallback(() => {
		setSearchIsOpen((prevIsOpen: boolean) => !prevIsOpen)
	}, [])

	return (
		<GlobalSearchContext.Provider
			value={{
				isGlobalSearchEnabled,
				searchIsOpen,
				toggleSearchIsOpen,
			}}
		>
			{children}
		</GlobalSearchContext.Provider>
	)
}

const useGlobalSearch = (): GlobalSearchContextValue => {
	const context = useContext(GlobalSearchContext)
	if (context === undefined) {
		throw new Error(
			'useGlobalSearch must be used within a GlobalSearchProvider'
		)
	}

	return context
}

export { GlobalSearchProvider, useGlobalSearch }
