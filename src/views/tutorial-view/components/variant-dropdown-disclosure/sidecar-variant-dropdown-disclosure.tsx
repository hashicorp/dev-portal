import DropdownDisclosure from 'components/dropdown-disclosure'
import { TutorialVariant } from 'views/tutorial-view/utils/variants'
import { VariantDropdownWithLabel, VariantDropdownDisclosureItems } from '.'
import s from './variant-dropdown-disclosure.module.css'

/**
 * @TODO we should refactor dropdown disclosure to accept
 * aria-labelledby instead of passing the aria-label with the
 * combined visual label text and active option
 * https://app.asana.com/0/1204333057896641/1204621995316433
 */

export function SidecarVariantDropdownDisclosure({
	variant,
}: {
	variant: TutorialVariant
}) {
	// @TODO hook this into useVariants hook once data is wired
	const activeOption = variant.options[0]

	return (
		<VariantDropdownWithLabel text={variant.name}>
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
		</VariantDropdownWithLabel>
	)
}
