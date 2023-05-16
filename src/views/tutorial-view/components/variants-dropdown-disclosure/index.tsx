import { useRouter } from 'next/router'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import Text from 'components/text'
import {
	getVariantParam,
	getVariantPath,
	TutorialVariantOption,
} from 'views/tutorial-view/utils/variants'
import { VariantsDropdownDisclosureProps } from './types'
import s from './variants-dropdown-disclosure.module.css'

export function VariantsDropdownDisclosure({
	variant,
}: VariantsDropdownDisclosureProps) {
	const { asPath } = useRouter()
	// @TODO hook this into useVariants hook once data is wired
	const activeOption = variant.options[0]

	return (
		<div className={s.root}>
			<Text weight="semibold" size={100} className={s.label}>
				{variant.name}
			</Text>
			<DropdownDisclosure
				aria-label={`${variant.name}: ${activeOption.name}`}
				color="secondary"
				text={activeOption.name}
				className={s.dropdownDisclosure}
				activatorClassName={s.dropdownActivator}
			>
				{variant.options.map((option: TutorialVariantOption) => (
					<DropdownDisclosureLinkItem
						key={option.slug}
						href={getVariantPath(
							asPath,
							getVariantParam(variant.slug, option.slug)
						)}
					>
						{option.name}
					</DropdownDisclosureLinkItem>
				))}
			</DropdownDisclosure>
		</div>
	)
}
