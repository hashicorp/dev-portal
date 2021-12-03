import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULT_MOBILE_WIDTH = 728

const DEFAULT_TABLET_WIDTH = 1000

interface DeviceSize extends DeviceSizeProviderProps {
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

const DeviceSizeContext = createContext<DeviceSize>(undefined)

const DeviceSizeProvider: React.FC = ({ children }) => {
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

    mobileMediaQueryListObject = window.matchMedia(
      `(max-width: ${mobileWidth}px)`
    )
    tabletMediaQueryListObject = window.matchMedia(
      `(min-width: ${mobileWidth + 1}px) and (max-width: ${tabletWidth}px)`
    )
  }

  const [value, setValue] = useState<DeviceSize>({
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
    <DeviceSizeContext.Provider value={value}>
      {children}
    </DeviceSizeContext.Provider>
  )
}

const useDeviceSize = (): DeviceSize => {
  const context = useContext(DeviceSizeContext)
  if (context === undefined) {
    throw new Error('useDeviceSize must be used within a DeviceSizeProvider')
  }

  return context
}

export { DeviceSizeProvider, useDeviceSize }
