import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
} from 'react'
import { Version } from 'lib/fetch-release-data'

interface CurrentVersion {
	currentVersion: Version
	isLatestVersion: boolean
	latestVersion: Version
	setCurrentVersion: Dispatch<SetStateAction<Version>>
}

const CurrentVersionContext = createContext<CurrentVersion | undefined>(
	undefined
)
CurrentVersionContext.displayName = 'CurrentVersionContext'

/**
 * Stores the currently selected version in the `ProductDownloadsView`, derives
 * `isLatestVersion` based on the data stored, and additionally returns a setter
 * function for updating the version stored.
 */
const CurrentVersionProvider: FC<{
	initialValue: Version
	latestVersion: Version
}> = ({ children, initialValue, latestVersion }) => {
	const [currentVersion, setCurrentVersion] = useState<Version>(initialValue)
	const isLatestVersion = currentVersion === latestVersion
	const value = {
		currentVersion,
		isLatestVersion,
		latestVersion,
		setCurrentVersion,
	}

	return (
		<CurrentVersionContext.Provider value={value}>
			{children}
		</CurrentVersionContext.Provider>
	)
}

/**
 * Provides a way to consume the value of `CurrentVersionProvider`.
 */
const useCurrentVersion = (): CurrentVersion => {
	const context = useContext(CurrentVersionContext)
	if (context === undefined) {
		throw new Error(
			'useCurrentVersion must be used within a CurrentVersionProvider'
		)
	}

	return context
}

export { CurrentVersionProvider, useCurrentVersion }
