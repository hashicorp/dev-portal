import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULT_MOBILE_WIDTH = 728

const DEFAULT_TABLET_WIDTH = 1000

const getDerivedStateVariables = ({ mobileWidth, tabletWidth, width }) => {
  let isMobile = false
  let isTablet = false

  if (width <= mobileWidth) {
    isMobile = true
  } else if (width <= tabletWidth) {
    isTablet = true
  }

  return { isMobile, isTablet }
}

const getDefaultValue = ({
  mobileWidth = DEFAULT_MOBILE_WIDTH,
  tabletWidth = DEFAULT_TABLET_WIDTH,
}) => {
  let height: number | undefined
  let width: number | undefined

  if (typeof window !== 'undefined') {
    height = window.innerHeight
    width = window.innerWidth
  }

  const { isMobile, isTablet } = getDerivedStateVariables({
    mobileWidth,
    tabletWidth,
    width,
  })

  return { height, isMobile, isTablet, mobileWidth, tabletWidth, width }
}

const DEFAULT_VALUE = {
  height: typeof window === 'undefined' ? undefined : window.innerHeight,
  width: typeof window === 'undefined' ? undefined : window.innerWidth,
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
  const [value, setValue] = useState<WindowSize>(() => {
    const defaultValue = getDefaultValue({ mobileWidth, tabletWidth })
    console.log('default context value:', defaultValue)
    return defaultValue
  })

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight
      const width = window.innerWidth
      const { isMobile, isTablet } = getDerivedStateVariables({
        mobileWidth,
        tabletWidth,
        width,
      })

      setValue({
        ...value,
        height,
        isMobile,
        isTablet,
        width,
      })
    }

    // Add the resize event listener
    window.addEventListener('resize', handleResize)

    // Remove resize listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileWidth, tabletWidth, value])

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
