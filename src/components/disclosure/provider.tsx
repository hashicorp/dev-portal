import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
} from 'react'

interface DisclosureContextState {
  closeDisclosure: () => void
  contentContainerId: string
  id: string
  isOpen: boolean
  openDisclosure: () => void
  toggleDisclosure: () => void
}

interface DisclosureProviderProps {
  children: ReactNode
  value: {
    id: string
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
  }
}

const DisclosureContext = createContext<DisclosureContextState | undefined>(
  undefined
)

/**
 * @TODO document
 */
const DisclosureProvider = ({ children, value }: DisclosureProviderProps) => {
  const { id, isOpen, setIsOpen } = value
  const contentContainerId = `${id}-content`

  const openDisclosure = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const closeDisclosure = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const toggleDisclosure = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

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
