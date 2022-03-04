import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'

type Version = string

type CurrentVersion = [Version, Dispatch<SetStateAction<Version>>] | undefined

const CurrentVersionContext = createContext<CurrentVersion>(undefined)

const CurrentVersionProvider: FC<{ initialValue: Version }> = ({
  children,
  initialValue,
}) => {
  const [currentVersion, setCurrentVersion] = useState<Version>(initialValue)

  return (
    <CurrentVersionContext.Provider value={[currentVersion, setCurrentVersion]}>
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
