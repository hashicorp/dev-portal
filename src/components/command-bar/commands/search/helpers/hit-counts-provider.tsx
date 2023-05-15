import { ReactNode, createContext, useContext, useState } from 'react'

// Create Context object.
const SearchHitsContext = createContext([])

// Provider
function SearchHitsProvider({ children }: { children: ReactNode }) {
	const value = useState({})

	return (
		<SearchHitsContext.Provider value={value}>
			{children}
		</SearchHitsContext.Provider>
	)
}

// useContext Hook.
function useHitsContext() {
	return useContext(SearchHitsContext)
}

export { useHitsContext }
export default SearchHitsProvider
