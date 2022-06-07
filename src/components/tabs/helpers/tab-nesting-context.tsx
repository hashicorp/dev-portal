import { createContext, useContext, ReactNode } from 'react'

type NestedTabContextValue = false

export function useIsNested(): NestedTabContextValue {
  return useContext(NestedTabContext)
}

const NestedTabContext = createContext(undefined)

export default function TabNestingProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <NestedTabContext.Provider value={true}>
      {children}
    </NestedTabContext.Provider>
  )
}
