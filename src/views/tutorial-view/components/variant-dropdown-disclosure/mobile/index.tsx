import { VariantDropdownDisclosure } from 'views/tutorial-view/components'
import { VariantDropdownDisclosureProps } from 'views/tutorial-view/components/variant-dropdown-disclosure/types'
import s from './mobile-variant-dropdown-disclosure.module.css'

export function MobileVariantDropdownDisclosure({
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
