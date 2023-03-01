/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
