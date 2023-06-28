/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { RadioField } from 'components/form/field-controls'
import { CONTENT_TYPES } from '../../constants'
import { FilterSection } from '../filter-section'

export interface ContentTypeFilterProps {
	refine: (value: string | null) => void
	selectedContentType: string
}

export function ContentTypeFilter({
	refine,
	selectedContentType,
}: ContentTypeFilterProps) {
	const isAnythingSelected = selectedContentType !== undefined

	return (
		<FilterSection label="Type">
			<RadioField
				labelFontWeight="regular"
				label="All"
				value="all"
				name="type"
				id="all"
				checked={!isAnythingSelected}
				onChange={() => refine(null)}
			/>
			{CONTENT_TYPES.map(({ value, label }) => {
				const isSelected = value === selectedContentType

				const inputId = `filter-${value}`

				return (
					<RadioField
						key={value}
						labelFontWeight="regular"
						label={label}
						value={value}
						name="edition"
						id={inputId}
						checked={isSelected}
						onChange={() => refine(value)}
					/>
				)
			})}
		</FilterSection>
	)
}
