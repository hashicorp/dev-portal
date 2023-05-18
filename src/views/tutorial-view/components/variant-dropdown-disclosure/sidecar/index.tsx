import { VariantDropdownDisclosure } from '..'
import { VariantDropdownDisclosureProps } from '../types'
import s from './sidecar-variant-dropdown-disclosure.module.css'

export function SidecarVariantDropdownDisclosure({
	variant,
}: VariantDropdownDisclosureProps) {
	return (
		<VariantDropdownDisclosure
			variant={variant}
			classNames={{
				dropdownRoot: s.dropdownDisclosure,
				dropdownActivator: s.dropdownActivator,
			}}
		/>
	)
}
