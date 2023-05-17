import {
	createContext,
	useState,
	useContext,
	useMemo,
	ReactNode,
	Dispatch,
	SetStateAction,
	useEffect,
} from 'react'
import { TutorialVariant } from './types'

type VariantContextValue = {
	activeVariant?: TutorialVariant
	setActiveVariant?: Dispatch<SetStateAction<string>>
}

export function useVariants(): VariantContextValue {
	return useContext(VariantContext)
}

const VariantContext = createContext({ activeVariant: null })
VariantContext.displayName = 'VariantContext'

export default function VariantProvider({
	children,
	variant,
}: {
	children: ReactNode
	variant?: TutorialVariant // the type
}) {
	const [activeVariant, setActiveVariant] = useState<TutorialVariant>(variant)

	const contextValue = useMemo(
		() => ({ activeVariant, setActiveVariant }),
		[activeVariant]
	)

	useEffect(() => {
		if (
			variant &&
			variant.activeOption.slug !== activeVariant.activeOption.slug
		) {
			setActiveVariant(variant)
		}
	}, [variant, activeVariant])

	return (
		<VariantContext.Provider value={contextValue}>
			{children}
		</VariantContext.Provider>
	)
}
