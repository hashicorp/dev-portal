import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULT_MOBILE_WIDTH = 728

const DEFAULT_TABLET_WIDTH = 1000

const DEFAULT_VALUE = {
  height: undefined,
  width: undefined,
}

interface WindowSizeProviderProps {
  mobileWidth?: number
  tabletWidth?: number
}

interface WindowSize extends WindowSizeProviderProps {
  width: number
  height: number
  isMobile?: boolean
  isTablet?: boolean
}

const WindowSizeContext = createContext<WindowSize>(DEFAULT_VALUE)

const WindowSizeProvider: React.FC<WindowSizeProviderProps> = ({
  children,
  mobileWidth = DEFAULT_MOBILE_WIDTH,
  tabletWidth = DEFAULT_TABLET_WIDTH,
}) => {
  const [value, setValue] = useState<WindowSize>(DEFAULT_VALUE)

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight
      const width = window.innerWidth

      // Derive additional state
      let isMobile = false
      let isTablet = false
      if (width <= mobileWidth) {
        isMobile = true
      } else if (width <= tabletWidth) {
        isTablet = true
      }

      setValue({ height, isMobile, isTablet, mobileWidth, tabletWidth, width })
    }

    // Add the resize event listener
    window.addEventListener('resize', handleResize)

    // Call immediately to set the inital state values
    handleResize()

    // Remove resize listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileWidth, tabletWidth])

  return (
    <WindowSizeContext.Provider value={value}>
      {children}
    </WindowSizeContext.Provider>
  )
}

const useWindowSize = (): WindowSize => {
  const context = useContext(WindowSizeContext)
  if (context === undefined) {
    throw new Error('useWindowSize must be used within a WindowSizeProvider')
  }

  return context
}

export { WindowSizeProvider, useWindowSize }
