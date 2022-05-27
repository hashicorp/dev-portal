// Third-party imports
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useId } from '@react-aria/utils'

// Local imports
import { DisclosureContextState, DisclosureProps } from './types'
import {
  DisclosureActivator,
  DisclosureActivatorForwardedRef,
  DisclosureActivatorProps,
  DisclosureContent,
  DisclosureContentProps,
} from './components'
import { validateDisclosureChildren } from './helpers'
import s from './disclosure.module.css'

/**
 * An internal `Context` used for storing state about a single `Disclosure`. Is
 * not intended for use outside of this file.
 */
const DisclosureContext = createContext<DisclosureContextState>(undefined)

/**
 * A hook for exposing a `Disclosure`s state. Intended for use within the
 * `Disclosure` subcomponents.
 */
const useDisclosureState = (): DisclosureContextState => {
  const context = useContext(DisclosureContext)
  if (context === undefined) {
    throw new Error(
      'useDisclosureState must be used within a DisclosureContext.Provider'
    )
  }

  return context
}

/**
 * Intended to be used as an internal utility class. Maintains its open/closed
 * state, generates its own unique ID, handles closing itself when route changes
 * start, and instantiates a `DisclosureProvider`.
 *
 * Validates that has the correct children:
 *  - First, a `DisclosureActivator`
 *  - Second, a `DisclosureContent`
 *
 * @TODO possible future additions
 *  - add and invoke an `onOpen` callback when `openDisclosure` is called
 *  - add and invoke an `onClose` callback when `closeDisclosure` is called
 */
const Disclosure = ({
  children,
  containerClassName,
  initialOpen = false,
}: DisclosureProps) => {
  // check if the `children` are valid
  validateDisclosureChildren(children)

  // continue rendering the component if `children` are valid
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen)
  const uniqueId = `disclosure-${useId()}`
  const contentContainerId = `${uniqueId}-content`

  // create a memoized function for opening the disclosure
  const openDisclosure = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  // create a memoized function for closing the disclosure
  const closeDisclosure = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  // create a memoized function for toggling the disclosure
  const toggleDisclosure = useCallback(() => {
    if (isOpen) {
      closeDisclosure()
    } else {
      openDisclosure()
    }
  }, [closeDisclosure, isOpen, openDisclosure])

  // if the disclosure is open, handle closing it on `routeChangeStart`
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleRouteChangeStart = () => {
      closeDisclosure
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
    // Only need to base this on `isOpen`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // build the className prop to pass the `children` container
  const containerClasses = classNames(
    s.root,
    typeof containerClassName === 'function'
      ? containerClassName(isOpen)
      : containerClassName
  )

  const providerState: DisclosureContextState = {
    closeDisclosure,
    contentContainerId,
    uniqueId,
    isOpen,
    openDisclosure,
    toggleDisclosure,
  }

  return (
    <DisclosureContext.Provider value={providerState}>
      <div className={containerClasses}>{children}</div>
    </DisclosureContext.Provider>
  )
}

export type {
  DisclosureActivatorForwardedRef,
  DisclosureActivatorProps,
  DisclosureContentProps,
  DisclosureProps,
}
export { DisclosureActivator, DisclosureContent, useDisclosureState }
export default Disclosure
