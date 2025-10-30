/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { createContext, useContext, ReactNode } from 'react'

interface TutorialContextValue {
	tutorialLabId: string | null
}

const TutorialContext = createContext<TutorialContextValue>({
	tutorialLabId: null,
})

TutorialContext.displayName = 'TutorialContext'

export function TutorialProvider({
	tutorialLabId,
	children,
}: {
	tutorialLabId: string | null
	children: ReactNode
}) {
	return (
		<TutorialContext.Provider value={{ tutorialLabId }}>
			{children}
		</TutorialContext.Provider>
	)
}

export function useTutorialContext(): TutorialContextValue {
	const context = useContext(TutorialContext)
	return context
}
