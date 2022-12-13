import { createContext, useContext, useState } from 'react'

export const MobileDrawerContext = createContext({
	dialogOpen: false,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setDialogOpen: (() => {}) as React.Dispatch<React.SetStateAction<boolean>>,
})

export const MobileDrawerContextProvider = ({ children }) => {
	const [dialogOpen, setDialogOpen] = useState(false)
	return (
		<MobileDrawerContext.Provider
			value={{
				dialogOpen,
				setDialogOpen,
			}}
		>
			{children}
		</MobileDrawerContext.Provider>
	)
}

export const useMobileDrawerContext = () => useContext(MobileDrawerContext)
