import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react'

interface GlobalSearchContextValue {
	searchIsOpen: boolean
	toggleSearchIsOpen: () => void
}

interface GlobalSearchProviderProps {
	children: ReactNode
}

const GlobalSearchContext = createContext<GlobalSearchContextValue>(undefined)

const GlobalSearchProvider = ({ children }: GlobalSearchProviderProps) => {
	const [searchIsOpen, setSearchIsOpen] = useState<boolean>(false)
	const toggleSearchIsOpen = useCallback(() => {
		setSearchIsOpen((prevIsOpen: boolean) => !prevIsOpen)
	}, [])

	return (
		<GlobalSearchContext.Provider
			value={{
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
