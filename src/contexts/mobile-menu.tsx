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
import { useNoScrollBody } from 'hooks/use-no-scroll-body'

interface MobileMenuContextState {
  mobileMenuIsOpen: boolean
  setMobileMenuIsOpen: Dispatch<SetStateAction<boolean>>
}

interface MobileMenuProviderProps {
  children: ReactNode
}

const MobileMenuContext = createContext<MobileMenuContextState | undefined>(
  undefined
)

/**
 * Provider for managing open/closed state of the mobile menu.
 */
const MobileMenuProvider = ({ children }: MobileMenuProviderProps) => {
  const router = useRouter()
  const { isDesktop } = useDeviceSize()
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState<boolean>()

  /**
   * Prevents scrolling on the rest of the page body
   */
  useNoScrollBody(mobileMenuIsOpen)

  /**
   * Handles closing the mobile menu in some cases.
   */
  useEffect(() => {
    // Don't need to listen for router events on Desktop
    if (isDesktop) {
      // Close the mobile menu if the viewport size has crossed the breakpoint
      setMobileMenuIsOpen(false)
      return
    }

    // Close the mobile meun if it's open on route change start
    const handleRouteChange = () => {
      if (mobileMenuIsOpen) {
        setMobileMenuIsOpen(false)
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('routeChangeError', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('routeChangeError', handleRouteChange)
    }
  }, [isDesktop, mobileMenuIsOpen, router.events])

  const state: MobileMenuContextState = {
    mobileMenuIsOpen,
    setMobileMenuIsOpen,
  }

  return (
    <MobileMenuContext.Provider value={state}>
      {children}
    </MobileMenuContext.Provider>
  )
}

/**
 * Hook for exposing menu state and the setter for updating the state.
 */
const useMobileMenu = (): MobileMenuContextState => {
  const context = useContext(MobileMenuContext)
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider')
  }

  return context
}

export { MobileMenuProvider, useMobileMenu }
