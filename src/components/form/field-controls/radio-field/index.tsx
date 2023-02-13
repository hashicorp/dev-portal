/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useId } from '@react-aria/utils'
import { Errors, HelperText, Label } from 'components/form/components'
import RadioControl from 'components/form/base-controls/radio-control'
import { RadioFieldProps } from './types'
import s from './radio-field.module.css'

/**
 * NOTE: unlike CheckboxField, does not manage its own "checked" state. We want
 * to manage this at the RadioGroup level so that we can leverage the built-in
 * browser functionality for free.
 */
const RadioField = ({
	checked,
	errors,
	helperText,
	id,
	label,
	labelFontWeight,
	value,
	name,
	onChange,
	onClick,
	onKeyDown,
}: RadioFieldProps) => {
	const inputId = useId(id)

	let helperTextElement, helperTextElementId
	if (helperText) {
		helperTextElementId = `checkbox-${inputId}-helper-text`
		helperTextElement = (
			<HelperText className={s.helperText} id={helperTextElementId}>
				{helperText}
			</HelperText>
		)
	}

	let errorsElement
	if (errors && errors.length > 0) {
		errorsElement = <Errors className={s.errors} messages={errors} />
	}

	return (
		<div className={s.root}>
			<RadioControl
				aria-describedby={helperTextElementId}
				checked={checked}
				id={inputId}
				name={name}
				value={value}
				onChange={onChange}
				onClick={onClick}
				onKeyDown={onKeyDown}
			/>
			<Label className={s.label} fontWeight={labelFontWeight} htmlFor={inputId}>
				{label}
			</Label>
			{helperTextElement}
			{errorsElement}
		</div>
	)
}

export type { RadioFieldProps }
export default RadioField
