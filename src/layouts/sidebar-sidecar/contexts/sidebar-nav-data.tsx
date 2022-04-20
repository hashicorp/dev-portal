import {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useContext,
  useState,
} from 'react'
import { SidebarProps } from 'components/sidebar'

interface State {
  currentLevel: number
  hasManyLevels: boolean
  hasMaxLevels: boolean
  isFirstLevel: boolean
  isLastLevel: boolean
  isMiddleLevel: boolean
  setCurrentLevel: Dispatch<SetStateAction<number>>
}

const SidebarNavDataContext = createContext<State | undefined>(undefined)

interface SidebarNavDataProviderProps {
  children: ReactNode
  navDataLevels: SidebarProps[]
}

const SidebarNavDataProvider = ({
  children,
  navDataLevels,
}: SidebarNavDataProviderProps) => {
  const numberOfLevels = navDataLevels?.length
  const [currentLevel, setCurrentLevel] = useState<number>(
    numberOfLevels - 1 || 0
  )
  const state: State = {
    currentLevel,
    hasManyLevels: numberOfLevels > 1,
    hasMaxLevels: numberOfLevels === 3,
    isFirstLevel: currentLevel === 0,
    isLastLevel: currentLevel === numberOfLevels - 1,
    isMiddleLevel: currentLevel === 1,
    setCurrentLevel,
  }

  return (
    <SidebarNavDataContext.Provider value={state}>
      {children}
    </SidebarNavDataContext.Provider>
  )
}

const useSidebarNavData = () => {
  const context = useContext(SidebarNavDataContext)
  if (context === undefined) {
    throw new Error(
      'useSidebarNavData must be used within a SidebarNavDataProvider'
    )
  }

  return context
}

export { SidebarNavDataProvider, useSidebarNavData }
