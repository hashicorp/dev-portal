import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useId } from '@react-aria/utils'
import { DisclosureProps } from './types'
import { DisclosureProvider } from './provider'
import {
  DisclosureActivator,
  DisclosureActivatorProps,
  DisclosureContent,
  DisclosureContentProps,
} from './components'
import s from './disclosure.module.css'

/**
 * @TODO
 *  - add onOpen callback
 *  - add onClosed callback
 */
const Disclosure = ({
  children,
  containerClassName,
  containerCollapsedClassName,
  containerExpandedClassName,
  open = false,
}: DisclosureProps) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const uniqueId = `disclosure-${useId()}`

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleRouteChangeStart = () => {
      setIsOpen(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
    // Only need to base this on `isOpen`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const containerClasses = classNames(s.root, containerClassName, {
    [containerCollapsedClassName]: !isOpen,
    [containerExpandedClassName]: isOpen,
  })

  return (
    <DisclosureProvider value={{ id: uniqueId, isOpen, setIsOpen }}>
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
