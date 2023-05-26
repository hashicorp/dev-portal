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
import { useRouter } from 'next/router'

type VariantContextValue = {
	currentVariant?: TutorialVariant
	setCurrentVariant?: Dispatch<SetStateAction<TutorialVariant>>
}

interface VariantProviderProps {
	children: ReactNode
	variant?: TutorialVariant
}

export function useVariant(): VariantContextValue {
	return useContext(VariantContext)
}

const VariantContext = createContext({ currentVariant: null })
VariantContext.displayName = 'VariantContext'

export default function VariantProvider({
	children,
	variant,
}: VariantProviderProps) {
	const [currentVariant, setCurrentVariant] = useState<TutorialVariant>(variant)
	const router = useRouter()
	console.log({ router })

	const contextValue = useMemo(
		() => ({ currentVariant, setCurrentVariant }),
		[currentVariant, currentVariant?.activeOption]
	)

	useEffect(() => {
		// if the variant is passed from tutorial view, and the active option
		// doesn't match what is already instate, update it
		if (
			variant &&
			variant.activeOption.id !== currentVariant?.activeOption.id
		) {
			setCurrentVariant(variant)
		}
	}, [variant, variant?.activeOption, currentVariant?.activeOption])

	return (
		<VariantContext.Provider value={contextValue}>
			{children}
		</VariantContext.Provider>
	)
}
