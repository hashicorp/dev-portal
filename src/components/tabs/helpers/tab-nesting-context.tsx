import { createContext, useContext, ReactNode } from 'react'

type NestedTabContextValue = boolean

export function useIsNested(): NestedTabContextValue {
  return useContext(NestedTabContext)
}

const NestedTabContext = createContext<NestedTabContextValue>(false)

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
