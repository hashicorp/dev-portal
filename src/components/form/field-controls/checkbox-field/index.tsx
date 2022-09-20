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
	onClick = () => void 0,
	onChange = () => void 0,
}: CheckboxFieldProps) => {
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
			<CheckboxControl
				aria-describedby={helperTextElementId}
				checked={checked}
				id={inputId}
				name={name}
				onChange={onChange}
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
