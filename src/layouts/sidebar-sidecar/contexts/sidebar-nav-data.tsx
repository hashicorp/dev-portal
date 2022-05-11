import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { useDeviceSize } from 'contexts'
import { SidebarProps } from 'components/sidebar'

interface State {
  currentLevel: number
  hasManyLevels: boolean
  isFirstLevel: boolean
  isLastLevel: boolean
  setCurrentLevel: Dispatch<SetStateAction<number>>
  setSidebarIsOpen: Dispatch<SetStateAction<boolean>>
  shouldRenderMobileControls: boolean
  sidebarIsOpen: boolean
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
  const router = useRouter()
  const { isDesktop } = useDeviceSize()
  const numberOfLevels = navDataLevels.length
  const [currentLevel, setCurrentLevel] = useState<number>(numberOfLevels - 1)
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>()

  // Reset the current level if the device size or props change
  useEffect(() => {
    setCurrentLevel(numberOfLevels - 1)
  }, [isDesktop, navDataLevels, numberOfLevels])

  // Handles closing the Sidebar in some cases
  useEffect(() => {
    // Don't need to listen for router events on Desktop
    if (isDesktop) {
      // Close the Sidebar if the viewport size has crossed the breakpoint
      setSidebarIsOpen(false)
      return
    }

    // Close the Sidebar if it's open on route change start
    const handleRouteChange = () => {
      if (sidebarIsOpen) {
        setSidebarIsOpen(false)
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.off('routeChangeError', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('routeChangeError', handleRouteChange)
    }
  }, [router.events, sidebarIsOpen, isDesktop])

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
    setSidebarIsOpen,
    shouldRenderMobileControls,
    sidebarIsOpen,
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
