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
import { useRouter } from 'next/router'
import variantData from 'content/variants.json'

// context

// variants provider

// Variant Group

// Variant

//  First, just get the variant type from the url
//  in the future, it will be a json or yaml file in the tutorials repo
//  that is managed as a key / value pair
//  string[variantkey]: string[]
//  we will store the cookie with the key / value from array an use that to help hold state
//  we will generate paths for each subvariant so we don't deal with query params and we handle things serverside
//  there will need to be a default index path where a variant isn't selected yet, this could be the first
//  variant defined in the list... or the tutorial could define the default variant (not preferred)
//  variants are listed in order like tabs at the top of the tutorial view
//  they are just links.
//  will the default be canonical??? definitely at least for the sub path that is the same as default
//  - SEO question!!! important. and relates to the way tu wants to use variants if the most common usecase
//  has a lot of repeated content.
//  -----------
//  HOW DO WE HANDLE THE ROUTING
//  - query params is easier to reason about and cleaner, but we have the clientside problem
//           - look into how this was handled on learn with collections
//  - static paths feels a bit extra given the pages are exactly the same
//  - could we create a /variant param in the getstatic paths and truly make it a path?
//  - that would be a bit easier to parse from a link rewriting perspective
//  The ROUTING is the trickiest part here
//  Write up my thoughts on the state management - key value approach
//  definitely frontmatter with the variant component
//  the frontmatter will just reference one of the keys defined in the higher level
//  will we need to add a variant record to the data model? probably
//  whats returned from the api is the full list of available variants with the tutorial data

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
	console.log({ children }, 'VARIANT ', activeVariant)
	return activeVariant === type ? (
		<div>
			<h2 style={{ color: 'pink' }}>{`Variant: ${activeVariant}`}</h2>
			{children}
		</div>
	) : null
}

type VariantContextValue = {
	activeVariant?: string
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
	const [activeVariant, setActiveVariant] = useState<string>(variant)
	const router = useRouter()

	const contextValue = useMemo(
		() => ({ activeVariant, setActiveVariant }),
		[activeVariant]
	)

	useEffect(() => {
		if (typeof router.query.variant === 'string') {
			// if its a valid variant
			if (
				router.query.variant !== activeVariant &&
				isValidVariantOption(router.query.variant, variantData.consul)
			) {
				console.log('yeah')
				setActiveVariant(router.query.variant)
			}
		}
	}, [router.query.variant])

	return (
		<VariantContext.Provider value={contextValue}>
			{children}
		</VariantContext.Provider>
	)
}

function isValidVariantOption(variantOptionId, variantType) {
	console.log('hi')
	return Boolean(variantType.find((option) => option.id === variantOptionId))
}
