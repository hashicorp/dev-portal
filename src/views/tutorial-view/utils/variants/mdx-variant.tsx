import { ReactElement } from 'react'
import { useVariants } from './context'
import { TutorialVariantOption } from './types'

interface MdxVariantProps {
	slug: string // the variant slug
	option: string // the variant option slug
	children: ReactElement
}

export function MdxVariant({ slug, option, children }: MdxVariantProps) {
	const { activeVariant } = useVariants()
	const shouldRenderContent =
		activeVariant.slug === slug && activeVariant.activeOption.slug === option
	const isValidVariantOption = activeVariant.options.find(
		(o: TutorialVariantOption) => o.slug === option
	)

	if (!isValidVariantOption) {
		throw new Error(
			`[mdx-variant]: Option not valid for variant: '${slug}'. Please pass a slug of available options — ${activeVariant.options
				.map((o: TutorialVariantOption) => o.slug)
				.join(', ')}`
		)
	}

	return shouldRenderContent ? children : null
}
