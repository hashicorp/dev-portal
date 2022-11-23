import { createContext, useContext, ReactNode } from 'react'

type NestedTabContextValue = boolean

export function useIsNested(): NestedTabContextValue {
	return useContext(NestedTabContext)
}

const NestedTabContext = createContext<NestedTabContextValue>(false)
NestedTabContext.displayName = 'NestedTabContext'

/**
 * This provider allows <Tabs /> to be aware of nesting. Specifically,
 * it allows nested <Tabs /> to have context on when they're being rendered
 * within wrapping <Tabs />.
 */
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
