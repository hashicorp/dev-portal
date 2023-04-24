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

export function MdxVariant({
	type,
	children,
}: {
	type: string
	children: ReactNode
}) {
	// check if is active
	// potentially just 'hide' to retain SEO on canonical link
	const { activeVariant } = useVariants() // or is default

	return activeVariant === type ? (
		<div>
			<h2 style={{ color: 'pink' }}>{`Variant: ${activeVariant}`}</h2>
			{children}
		</div>
	) : null
}

type VariantContextValue = {
	activeVariant?: string // EXPAND THIS TO INCLUDE THE ENTIRE VARIANT DATASET, with all options etc
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
	variant?: string // the type
}) {
	console.log('variant in provider', variant)
	const [activeVariant, setActiveVariant] = useState<string>(variant)

	const contextValue = useMemo(
		() => ({ activeVariant, setActiveVariant }),
		[activeVariant]
	)

	useEffect(() => {
		if (variant !== activeVariant) {
			setActiveVariant(variant)
		}
	}, [variant, activeVariant, setActiveVariant])

	return (
		<VariantContext.Provider value={contextValue}>
			{children}
		</VariantContext.Provider>
	)
}

// TODO Need to add this validation, requires knowledge of the active type
function isValidVariantOption(variantOptionId, variantType) {
	return Boolean(variantType.find((option) => option.id === variantOptionId))
}
