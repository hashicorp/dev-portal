import {
	createContext,
	useState,
	useContext,
	useMemo,
	ReactNode,
	Dispatch,
	SetStateAction,
} from 'react'

// context

// variants provider

// Variant Group

// Variant

/**
 * First, just get the variant type from the url
 *
 * in the future, it will be a json or yaml file in the tutorials repo
 * that is managed as a key / value pair
 *
 * string[variantkey]: string[]
 *
 * we will store the cookie with the key / value from array an use that to help hold state
 *
 * we will generate paths for each subvariant so we don't deal with query params and we handle things serverside
 *
 * there will need to be a default index path where a variant isn't selected yet, this could be the first
 * variant defined in the list... or the tutorial could define the default variant (not preferred)
 *
 * variants are listed in order like tabs at the top of the tutorial view
 *
 * they are just links.
 *
 * will the default be canonical??? definitely at least for the sub path that is the same as default
 * - SEO question!!! important. and relates to the way tu wants to use variants if the most common usecase
 * has a lot of repeated content.
 */

export function MdxVariant({
	type,
	children,
}: {
	type: string
	children: ReactNode
}) {
	// check if is active
	// potentially just 'hide' to retain SEO on canonical link
	const { activeVariant } = useVariants()
	console.log({ children }, 'VARIANT ', activeVariant)
	return activeVariant === type ? <div>{children}</div> : null
}

type VariantContextValue = {
	activeVariant?: string
	setActiveVariant?: Dispatch<SetStateAction<string>>
}

export function useVariants(): VariantContextValue {
	return useContext(VariantContext)
}

const VariantContext = createContext(undefined)
VariantContext.displayName = 'VariantContext'

export default function VariantProvider({
	children,
	initialVariant,
}: {
	children: ReactNode
	initialVariant?: string // the type
}) {
	const [activeVariant, setActiveVariant] = useState<string>(initialVariant)
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
