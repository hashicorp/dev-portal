import { CheckboxFieldProps } from 'components/form/field-controls'
import { DropdownDisclosureProps } from 'components/dropdown-disclosure'

interface MultiSelectOption {
	id: CheckboxFieldProps['id']
	label: string
	onChange: CheckboxFieldProps['onChange']
	selected: boolean
}

interface MultiSelectProps {
	options: MultiSelectOption[]
	text: DropdownDisclosureProps['text']
}

export type { MultiSelectOption, MultiSelectProps }
