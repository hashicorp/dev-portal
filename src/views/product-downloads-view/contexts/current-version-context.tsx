import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'

type Version = string

interface CurrentVersion {
  currentVersion: Version
  isLatestVersion: boolean
  latestVersion: Version
  setCurrentVersion: Dispatch<SetStateAction<Version>>
}

const CurrentVersionContext = createContext<CurrentVersion | undefined>(
  undefined
)

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
