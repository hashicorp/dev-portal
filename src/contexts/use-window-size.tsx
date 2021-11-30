import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULT_MOBILE_WIDTH = 728

const DEFAULT_TABLET_WIDTH = 1000

// const getDerivedStateVariables = ({ mobileWidth, tabletWidth, width }) => {
//   let isMobile = false
//   let isTablet = false

//   if (width <= mobileWidth) {
//     isMobile = true
//   } else if (width <= tabletWidth) {
//     isTablet = true
//   }

//   return { isMobile, isTablet }
// }

// const getDefaultValue = ({
//   mobileWidth = DEFAULT_MOBILE_WIDTH,
//   tabletWidth = DEFAULT_TABLET_WIDTH,
// }) => {
//   let height: number | undefined
//   let width: number | undefined

//   if (typeof window !== 'undefined') {
//     height = window.innerHeight
//     width = window.innerWidth
//   }

//   const { isMobile, isTablet } = getDerivedStateVariables({
//     mobileWidth,
//     tabletWidth,
//     width,
//   })

//   // return { height, isMobile, isTablet, mobileWidth, tabletWidth, width }

//   return { height: undefined, width: undefined }
// }

// const DEFAULT_VALUE = {
//   height: typeof window === 'undefined' ? undefined : window.innerHeight,
//   width: typeof window === 'undefined' ? undefined : window.innerWidth,
// }

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

const WindowSizeContext = createContext<WindowSize>(undefined)

const WindowSizeProvider: React.FC<WindowSizeProviderProps> = ({
  children,
  mobileWidth = DEFAULT_MOBILE_WIDTH,
  tabletWidth = DEFAULT_TABLET_WIDTH,
}) => {
  let mobileMediaQueryListObject
  let tabletMediaQueryListObject
  if (typeof window !== 'undefined') {
    mobileMediaQueryListObject = window.matchMedia(
      `(max-width: ${mobileWidth}px)`
    )
    tabletMediaQueryListObject = window.matchMedia(
      `(min-width: ${mobileWidth + 1}px) and (max-width: ${tabletWidth}px)`
    )
  }

  const [value] = useState<WindowSize>({
    isMobile: mobileMediaQueryListObject?.matches,
    isTablet: tabletMediaQueryListObject?.matches,
  })

  // useEffect(() => {
  //   // Define the code to execute
  //   function doSomething() {
  //     const height = window.innerHeight
  //     const width = window.innerWidth
  //     const isMobile = width <= DEFAULT_MOBILE_WIDTH
  //     const isTablet = tabletMediaQueryListObject.matches

  //     console.log({ isMobile, isTablet })

  //     setValue((prevValue) => ({
  //       ...prevValue,
  //       height,
  //       isMobile,
  //       isTablet,
  //       width,
  //     }))
  //   }

  //   // Attach the event listeners with the function to execute
  //   tabletMediaQueryListObject.addEventListener('change', doSomething)

  //   // Execute your function once in case your current screen size
  //   // already mets the media query conditions
  //   doSomething()

  //   return () => {
  //     tabletMediaQueryListObject.removeEventListener('change', doSomething)
  //   }
  // }, [mobileWidth, tabletWidth])

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
