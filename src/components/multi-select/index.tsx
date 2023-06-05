/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import DropdownDisclosure, {
	DropdownDisclosureListItem,
} from 'components/dropdown-disclosure'
import { CheckboxField } from 'components/form/field-controls'
import { MultiSelectOption, MultiSelectProps } from './types'
import s from './multi-select.module.css'

const MultiSelect = ({ text, options }: MultiSelectProps) => {
	// If there are no options, don't render the dropdown since it throws
	// when 0 children are passed.
	if (!options.length) {
		return null
	}
	return (
		<DropdownDisclosure
			closeOnRouteChangeStart={false}
			color="secondary"
			text={text}
		>
			{options.map(({ id, label, onChange, selected }: MultiSelectOption) => {
				return (
					<DropdownDisclosureListItem key={id}>
						<div className={s.option}>
							<CheckboxField
								checked={selected}
								id={id}
								label={label}
								labelFontWeight="regular"
								onChange={onChange}
							/>
						</div>
					</DropdownDisclosureListItem>
				)
			})}
		</DropdownDisclosure>
	)
}

export type { MultiSelectOption, MultiSelectProps }
export default MultiSelect
