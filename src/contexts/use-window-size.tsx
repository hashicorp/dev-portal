import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULT_MOBILE_WIDTH = 728

const DEFAULT_TABLET_WIDTH = 1000

interface WindowSizeProviderProps {
  mobileWidth?: number
  tabletWidth?: number
}

interface WindowSize extends WindowSizeProviderProps {
  width?: number
  height?: number
  isMobile?: boolean
  isTablet?: boolean
}

// TODO: does this seem useful as a helper/util?
const getCSSVariableFromDocument = (
  variableName: string,
  options: { asNumber?: boolean } = {}
): string | number => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    variableName
  )

  if (options.asNumber) {
    return parseInt(value, 10)
  }

  return value
}

const WindowSizeContext = createContext<WindowSize>(undefined)

const WindowSizeProvider: React.FC<WindowSizeProviderProps> = ({
  children,
}) => {
  let mobileWidth: number
  let tabletWidth: number
  let mobileMediaQueryListObject: MediaQueryList
  let tabletMediaQueryListObject: MediaQueryList
  if (typeof window !== 'undefined') {
    mobileWidth =
      (getCSSVariableFromDocument('--mobile-width-breakpoint', {
        asNumber: true,
      }) as number) || DEFAULT_MOBILE_WIDTH
    tabletWidth =
      (getCSSVariableFromDocument('--tablet-width-breakpoint', {
        asNumber: true,
      }) as number) || DEFAULT_TABLET_WIDTH

    console.log(getCSSVariableFromDocument('--mobile'))

    mobileMediaQueryListObject = window.matchMedia(
      `(max-width: ${mobileWidth}px)`
    )
    tabletMediaQueryListObject = window.matchMedia(
      `(min-width: ${mobileWidth + 1}px) and (max-width: ${tabletWidth}px)`
    )
  }

  const [value, setValue] = useState<WindowSize>({
    isMobile: mobileMediaQueryListObject?.matches,
    isTablet: tabletMediaQueryListObject?.matches,
  })

  useEffect(() => {
    const handleChange = () => {
      setValue({
        isMobile: mobileMediaQueryListObject?.matches,
        isTablet: tabletMediaQueryListObject?.matches,
      })
    }

    mobileMediaQueryListObject.addEventListener('change', handleChange)
    tabletMediaQueryListObject.addEventListener('change', handleChange)

    return () => {
      mobileMediaQueryListObject.removeEventListener('change', handleChange)
      tabletMediaQueryListObject.removeEventListener('change', handleChange)
    }
  }, [
    mobileMediaQueryListObject,
    mobileWidth,
    tabletMediaQueryListObject,
    tabletWidth,
  ])

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
