import { ReactNode, createContext, useContext, useState } from 'react'

// Create Context object.
const HitCountsContext = createContext([])

// Provider
function HitCountsProvider({ children }: { children: ReactNode }) {
	const value = useState({})

	return (
		<HitCountsContext.Provider value={value}>
			{children}
		</HitCountsContext.Provider>
	)
}

// useContext Hook.
function useHitCountsContext() {
	return useContext(HitCountsContext)
}

export { useHitCountsContext }
export default HitCountsProvider
