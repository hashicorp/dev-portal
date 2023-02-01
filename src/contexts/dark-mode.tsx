import { createContext, ReactNode, useContext, useState } from 'react'

const DarkModeContext = createContext(undefined)

export function DarkModeProvider({ children }: { children: ReactNode }) {
	const [isActive, setIsActive] = useState(false)
	return (
		<DarkModeContext.Provider value={{ isActive, setIsActive }}>
			{children}
		</DarkModeContext.Provider>
	)
}

export function useDarkMode() {
	const context = useContext(DarkModeContext)

	if (!context) {
		throw new Error('`useDarkMode` must be used within the DarkModeProvider')
	}

	return context
}
