import { createContext, ReactNode, useContext } from 'react'

type CurrentContentType = 'global' | 'docs' | 'tutorials'

const CurrentContentTypeContext = createContext<CurrentContentType>(undefined)
CurrentContentTypeContext.displayName = 'CurrentContentTypeContext'

interface CurrentContentTypeProviderProps {
	children: ReactNode
	currentContentType: CurrentContentType
}

/**
 * Stores the current content type being viewed in a page. This information is
 * useful when we want to show a different UI based on the type of content a
 * user is actively viewing.
 *
 * Example: Global Search will automatically show tutorial search results before
 * docs search when `currentContentType` is "tutorials".
 *
 * To change the value of `currentContentType`, the `contentType` property can
 * be added to a component that is rendered as a page. See `CustomPageComponent`
 * for reference.
 */
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
