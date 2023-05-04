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

export interface Variant {
	[key: string]: VariantOption[]
}

export interface VariantOption {
	id: string
	name: string
}

export function MdxVariant({
	option,
	children,
}: {
	option: string
	children: ReactNode
}) {
	// check if is active
	// potentially just 'hide' to retain SEO on canonical link
	const { activeVariant } = useVariants() // or is default

	return activeVariant === option ? (
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

/**
 * @TODO
 * - handle all variant data for the tutorial,
 * - needs to be able to do undefined
 *
 */

export default function VariantProvider({
	children,
	variant,
}: {
	children: ReactNode
	variant?: string // the type
}) {
	const [activeVariant, setActiveVariant] = useState<string>(variant)

	const contextValue = useMemo(
		() => ({ activeVariant, setActiveVariant }),
		[activeVariant]
	)

	return (
		<VariantContext.Provider value={contextValue}>
			{children}
		</VariantContext.Provider>
	)
}
