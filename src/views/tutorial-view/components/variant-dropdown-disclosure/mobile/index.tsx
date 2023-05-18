import { useId } from '@react-aria/utils'
import DropdownDisclosure from 'components/dropdown-disclosure'
import {
	VariantDropdownDisclosureItems,
	VariantDropdownWithLabel,
} from 'views/tutorial-view/components'
import { VariantDropdownDisclosureProps } from 'views/tutorial-view/components/variant-dropdown-disclosure/types'
import s from './mobile-variant-dropdown-disclosure.module.css'

export function MobileVariantDropdownDisclosure({
	variant,
	className,
}: VariantDropdownDisclosureProps) {
	// @TODO hook this into useVariants hook once data is wired
	const activeOption = variant.options[0]
	const labelId = useId()

	return (
		<span className={className}>
			<VariantDropdownWithLabel text={variant.name} id={labelId}>
				<DropdownDisclosure
					aria-describedby={labelId}
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
		</span>
	)
}
