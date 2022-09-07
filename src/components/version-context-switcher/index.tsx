import { ReactElement, useState } from 'react'
import { useCurrentProduct } from 'contexts'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
	DropdownDisclosureLabelItem,
} from 'components/dropdown-disclosure'
import { ContextSwitcherOption, VersionContextSwitcherProps } from './types'
import s from './version-context-switcher.module.css'

/**
 * To be used as control that changes the content of a page or as form control.
 * This component should not be used for page navigation because it does not
 * have the semantics for doing so.
 *
 * TODO: this will eventually render a ContextSwitcher, it just hasn't been
 * built yet for the sake of time and because the component is also a WIP on the
 * design systems side.
 */
const VersionContextSwitcher = ({
	initialValue,
	onChange,
	options,
}: VersionContextSwitcherProps): ReactElement => {
	const currentProduct = useCurrentProduct()
	const [selectedVersion, setSelectedVersion] = useState<ContextSwitcherOption>(
		initialValue || options[0]
	)

	/**
	 * Handle change event for switcher, invoking the `onChange` function last if
	 * it has been passed in the `onChange` prop.
	 */
	const handleChange = (selected: ContextSwitcherOption) => {
		setSelectedVersion(selected)

		if (onChange) {
			onChange(selected.value)
		}
	}

	return (
		<DropdownDisclosure
			aria-label="Choose a different version to install"
			className={s.dropdownList}
			text={selectedVersion.label}
			color="secondary"
			listPosition="right"
		>
			<DropdownDisclosureLabelItem>
				{currentProduct.name}
			</DropdownDisclosureLabelItem>
			{options
				// Hide currently selected version from dropdown list
				.filter(
					(option: ContextSwitcherOption) =>
						option.value !== selectedVersion.value
				)
				.map((option: ContextSwitcherOption) => (
					<DropdownDisclosureButtonItem
						aria-label={`${currentProduct.name} ${option.label}`}
						key={option.value}
						onClick={() => handleChange(option)}
					>
						{option.label}
					</DropdownDisclosureButtonItem>
				))}
		</DropdownDisclosure>
	)
}

export type { ContextSwitcherOption, VersionContextSwitcherProps }
export default VersionContextSwitcher
