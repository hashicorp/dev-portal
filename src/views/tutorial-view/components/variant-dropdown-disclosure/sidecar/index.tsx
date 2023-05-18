import { useId } from '@react-aria/utils'
import DropdownDisclosure from 'components/dropdown-disclosure'
import { VariantDropdownWithLabel, VariantDropdownDisclosureItems } from '../'
import { VariantDropdownDisclosureProps } from '../types'
import s from './sidecar-variant-dropdown-disclosure.module.css'

export function SidecarVariantDropdownDisclosure({
	variant,
}: VariantDropdownDisclosureProps) {
	// @TODO hook this into useVariants hook once data is wired
	const activeOption = variant.options[0]
	const labelId = useId()

	return (
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
	)
}
