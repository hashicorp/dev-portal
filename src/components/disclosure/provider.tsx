import { createContext, ReactNode, useCallback, useContext } from 'react'

interface DisclosureProviderValueProp {
  id: string
  isOpen: boolean
  openDisclosure: () => void
  closeDisclosure: () => void
}

interface DisclosureProviderProps {
  children: ReactNode
  value: DisclosureProviderValueProp
}

interface DisclosureContextState extends DisclosureProviderValueProp {
  contentContainerId: string
  toggleDisclosure: () => void
}

const DisclosureContext = createContext<DisclosureContextState | undefined>(
  undefined
)

/**
 * @TODO document
 */
const DisclosureProvider = ({ children, value }: DisclosureProviderProps) => {
  const { id, isOpen, openDisclosure, closeDisclosure } = value
  const contentContainerId = `${id}-content`

  const toggleDisclosure = useCallback(() => {
    if (isOpen) {
      closeDisclosure()
    } else {
      openDisclosure()
    }
  }, [closeDisclosure, isOpen, openDisclosure])

  const state: DisclosureContextState = {
    closeDisclosure,
    contentContainerId,
    id,
    isOpen,
    openDisclosure,
    toggleDisclosure,
  }

  return (
    <DisclosureContext.Provider value={state}>
      {children}
    </DisclosureContext.Provider>
  )
}

/**
 * @TODO
 *  - document
 *  - use different name? Intended to only be used by Disclosure and its
 *    subcomponents
 */
const useDisclosure = () => {
  const context = useContext(DisclosureContext)
  if (context === undefined) {
    throw new Error(
      'useIsBetaProduct must be used within a CurrentProductProvider'
    )
  }

  return context
}

export { DisclosureProvider, useDisclosure }
