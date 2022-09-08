import { createContext, ReactNode, useContext } from 'react'

type CurrentContentType = 'global' | 'docs' | 'tutorials'

const CurrentContentTypeContext = createContext<CurrentContentType>(undefined)

interface CurrentContentTypeProviderProps {
	children: ReactNode
	currentContentType: CurrentContentType
}

const CurrentContentTypeProvider = ({
	children,
	currentContentType,
}: CurrentContentTypeProviderProps) => {
	return (
		<CurrentContentTypeContext.Provider value={currentContentType}>
			{children}
		</CurrentContentTypeContext.Provider>
	)
}

const useCurrentContentType = (): CurrentContentType => {
	const context = useContext(CurrentContentTypeContext)
	if (context === undefined) {
		throw new Error(
			'useCurrentContentType must be used within a CurrentContentTypeProvider'
		)
	}

	return context
}

export type { CurrentContentType }
export { CurrentContentTypeProvider, useCurrentContentType }
