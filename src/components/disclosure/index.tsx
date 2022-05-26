// Third-party imports
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useId } from '@react-aria/utils'

// Local imports
import { DisclosureProps } from './types'
import { DisclosureProvider } from './provider'
import {
  DisclosureActivator,
  DisclosureActivatorProps,
  DisclosureContent,
  DisclosureContentProps,
} from './components'
import { validateDisclosureChildren } from './helpers'
import s from './disclosure.module.css'

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
 *  - replace the container className props with a single object that has
 *    specifically named properties associated with the container's state
 */
const Disclosure = ({
  children,
  containerClassName,
  containerCollapsedClassName,
  containerExpandedClassName,
  open = false,
}: DisclosureProps) => {
  // check if the `children` are valid
  validateDisclosureChildren(children)

  // continue rendering the component if `children` are valid
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const uniqueId = `disclosure-${useId()}`

  // create a memoized function for opening the disclosure
  const openDisclosure = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  // create a memoized function for closing the disclosure
  const closeDisclosure = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

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

  // build the className prop passed the `children` container
  const containerClasses = classNames(s.root, containerClassName, {
    [containerCollapsedClassName]: !isOpen,
    [containerExpandedClassName]: isOpen,
  })

  return (
    <DisclosureProvider
      value={{ id: uniqueId, isOpen, openDisclosure, closeDisclosure }}
    >
      <div className={containerClasses}>{children}</div>
    </DisclosureProvider>
  )
}

export type {
  DisclosureActivatorProps,
  DisclosureContentProps,
  DisclosureProps,
}
export { DisclosureActivator, DisclosureContent }
export default Disclosure
