import { createContext, useContext, ReactNode } from 'react'
import type { FeatureFlags } from 'lib/posthog' // export this type too

type ExperimentsContextValue = {
    flags: FeatureFlags
}

const ExperimentsContext = createContext<ExperimentsContextValue>({ flags: {} })

export const useExperiments = () => useContext(ExperimentsContext)

export const ExperimentsProvider = ({
    flags,
    children,
}: {
    flags: FeatureFlags
    children: ReactNode
}) => (
    <ExperimentsContext.Provider value={{ flags }}>
        {children}
    </ExperimentsContext.Provider>
)