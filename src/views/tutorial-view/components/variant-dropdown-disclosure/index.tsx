import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { DropdownDisclosureLinkItem } from 'components/dropdown-disclosure'
import Text from 'components/text'
import {
	getVariantParam,
	getVariantPath,
	TutorialVariant,
	TutorialVariantOption,
} from 'views/tutorial-view/utils/variants'
import { SidecarVariantDropdownDisclosure } from './sidecar'
import s from './variant-dropdown-disclosure.module.css'

export function VariantDropdownWithLabel({
	text,
	children,
}: {
	text: string
	children: ReactNode
}) {
	return (
		<div className={s.labelRoot}>
			<Text weight="semibold" size={100} className={s.label}>
				{text}
			</Text>
			{children}
		</div>
	)
}

export function VariantDropdownDisclosureItems({
	variant,
	activeOption,
}: {
	variant: TutorialVariant
	activeOption: TutorialVariantOption
}) {
	const { asPath } = useRouter()
	return (
		<>
			{variant.options.map((option: TutorialVariantOption) => {
				if (option.slug === activeOption.slug) {
					return null
				}

				return (
					<DropdownDisclosureLinkItem
						key={option.slug}
						href={getVariantPath(
							asPath,
							getVariantParam(variant.slug, option.slug)
						)}
					>
						{option.name}
					</DropdownDisclosureLinkItem>
				)
			})}
		</>
	)
}

export { SidecarVariantDropdownDisclosure }
