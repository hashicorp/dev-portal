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
	setActiveVariant?: Dispatch<SetStateAction<TutorialVariant>>
}

interface VariantProviderProps {
	children: ReactNode
	variant?: TutorialVariant
}

export function useVariants(): VariantContextValue {
	return useContext(VariantContext)
}

const VariantContext = createContext({ activeVariant: null })
VariantContext.displayName = 'VariantContext'

export default function VariantProvider({
	children,
	variant,
}: VariantProviderProps) {
	const [activeVariant, setActiveVariant] = useState<TutorialVariant>(variant)

	const contextValue = useMemo(
		() => ({ activeVariant, setActiveVariant }),
		[activeVariant]
	)

	useEffect(() => {
		if (variant && variant.activeOption.id !== activeVariant?.activeOption.id) {
			setActiveVariant(variant)
		}
	}, [variant, activeVariant])

	return (
		<VariantContext.Provider value={contextValue}>
			{children}
		</VariantContext.Provider>
	)
}
