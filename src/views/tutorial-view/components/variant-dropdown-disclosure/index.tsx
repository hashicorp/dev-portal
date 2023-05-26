import { useId } from '@react-aria/utils'
import { useRouter } from 'next/router'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import Text from 'components/text'
import {
	getVariantParam,
	getVariantPath,
	handleVariantCookie,
	sortVariantOptions,
	TutorialVariantOption,
} from 'views/tutorial-view/utils/variants'
import { VariantDropdownDisclosureProps } from './types'
import s from './variant-dropdown-disclosure.module.css'


export function VariantDropdownDisclosure({
	variant,
	isFullWidth,
}: VariantDropdownDisclosureProps) {
	const labelId = useId()
	const { asPath } = useRouter()

	return (
		<div className={s.root}>
			<Text weight="semibold" size={100} className={s.label} id={labelId}>
				{variant.name}
			</Text>
			<DropdownDisclosure
				aria-describedby={labelId}
				color="secondary"
				text={variant.activeOption.name}
				isFullWidth={isFullWidth}
			>
				{variant.options
					.sort(sortVariantOptions)
					.map((option: TutorialVariantOption) => {
						if (option.slug === variant.activeOption.slug) {
							return null
						}

						return (
							<DropdownDisclosureLinkItem
								key={option.slug}
								href={getVariantPath(
									asPath,
									getVariantParam(variant.slug, option.slug)
								)}
								onClick={() => {
									handleVariantCookie(variant.slug, option.slug)
								}}
							>
								{option.name}
							</DropdownDisclosureLinkItem>
						)
					})}
			</DropdownDisclosure>
		</div>
	)
}
