import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import Text from 'components/text'
import {
	getVariantParam,
	getVariantPath,
	TutorialVariant,
	TutorialVariantOption,
} from 'views/tutorial-view/utils/variants'
import { VariantDropdownDisclosureProps } from './types'
import s from './variant-dropdown-disclosure.module.css'

/**
 * @TODO we should refactor dropdown disclosure to accept
 * aria-labelledby instead of passing the aria-label with the
 * combined visual label text and active option
 * https://app.asana.com/0/1204333057896641/1204621995316433
 */

export function VariantDropdownDisclosure({
	variant,
	className,
}: VariantDropdownDisclosureProps) {
	// @TODO hook this into useVariants hook once data is wired
	const activeOption = variant.options[0]

	return (
		<DropdownDisclosure
			aria-label={`${variant.name}: ${activeOption.name}`}
			color="secondary"
			text={activeOption.name}
			className={s.dropdownDisclosure}
			activatorClassName={s.dropdownActivator}
		>
			<VariantDropdownDisclosureItems
				variant={variant}
				activeOption={activeOption}
			/>
		</DropdownDisclosure>
	)
}

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
