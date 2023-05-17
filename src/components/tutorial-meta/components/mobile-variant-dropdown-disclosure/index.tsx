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
import { VariantDropdownDisclosureProps } from 'views/tutorial-view/components/variant-dropdown-disclosure/types'
import s from './mobile-variant-dropdown-disclosure.module.css'

/**
 * @TODO we should refactor dropdown disclosure to accept
 * aria-labelledby instead of passing the aria-label with the
 * combined visual label text and active option
 * https://app.asana.com/0/1204333057896641/1204621995316433
 */

export function MobileVariantDropdownDisclosure({
	variant,
	className,
}: VariantDropdownDisclosureProps) {
	const { asPath } = useRouter()
	// @TODO hook this into useVariants hook once data is wired
	const activeOption = variant.options[1]

	return (
		<div className={className}>
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
			</DropdownDisclosure>
		</div>
	)
}
