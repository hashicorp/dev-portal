import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useDeviceSize } from 'contexts'
import { SidebarProps } from 'components/sidebar'

interface State {
  currentLevel: number
  hasManyLevels: boolean
  isFirstLevel: boolean
  isLastLevel: boolean
  setCurrentLevel: Dispatch<SetStateAction<number>>
  shouldRenderMobileControls: boolean
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
  const { isDesktop } = useDeviceSize()
  const numberOfLevels = navDataLevels.length
  const [currentLevel, setCurrentLevel] = useState<number | null>()

  // Reset the current level if the device size or props change
  useEffect(() => {
    setCurrentLevel(numberOfLevels - 1)
  }, [isDesktop, navDataLevels, numberOfLevels])

  // Derive booleans based on main state
  const hasManyLevels = numberOfLevels > 1
  const isFirstLevel = currentLevel === 0
  const isLastLevel = currentLevel === numberOfLevels - 1
  const shouldRenderMobileControls = hasManyLevels && !isDesktop

  // Create state object to pass to the Provider
  const state: State = {
    currentLevel,
    hasManyLevels,
    isFirstLevel,
    isLastLevel,
    setCurrentLevel,
    shouldRenderMobileControls,
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
