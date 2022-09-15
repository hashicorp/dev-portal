import { useState } from 'react'
import { useId } from '@react-aria/utils'
import { Errors, HelperText, Label } from 'components/form/components'
import { CheckboxControl } from 'components/form/base-controls'
import { CheckboxFieldProps } from './types'
import s from './checkbox-field.module.css'

const CheckboxField = ({
	checked,
	errors,
	helperText,
	id,
	label,
	labelFontWeight,
	name,
	onChange = () => null, // Default value makes this easier to invoke w/o extra logic
	onClick,
}: CheckboxFieldProps) => {
	const inputId = useId(id)
	const [isChecked, setIsChecked] = useState<boolean>(checked)

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
			<CheckboxControl
				aria-describedby={helperTextElementId}
				checked={isChecked}
				id={inputId}
				name={name}
				onChange={(e) => {
					setIsChecked((previousIsChecked: boolean) => !previousIsChecked)
					onChange(e)
				}}
				onClick={onClick}
			/>
			<Label className={s.label} fontWeight={labelFontWeight} htmlFor={inputId}>
				{label}
			</Label>
			{helperTextElement}
			{errorsElement}
		</div>
	)
}

export type { CheckboxFieldProps }
export default CheckboxField
