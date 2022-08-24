import { useState } from 'react'
import { useId } from '@react-aria/utils'
import { IconAlertDiamondFill16 } from '@hashicorp/flight-icons/svg-react/alert-diamond-fill-16'
import { Label } from 'components/form/components'
import { CheckboxControl } from 'components/form/base-controls'
import { CheckboxFieldProps } from './types'
import s from './checkbox-field.module.css'

const CheckboxField = ({
	errors,
	helperText,
	id,
	initialIsChecked = false,
	label,
	name,
}: CheckboxFieldProps) => {
	const inputId = useId(id)
	const [isChecked, setIsChecked] = useState<boolean>(initialIsChecked)

	let helperTextElement, helperTextElementId
	if (helperText) {
		helperTextElementId = `checkbox-${inputId}-helper-text`
		helperTextElement = (
			<span className={s.helperText} id={helperTextElementId}>
				{helperText}
			</span>
		)
	}

	let errorsElement
	if (errors && errors.length > 0) {
		errorsElement = (
			<div className={s.errorsContainer}>
				<IconAlertDiamondFill16 className={s.errorIcon} />
				<ul className={s.errorsList}>
					{errors.map((error: string) => (
						// eslint-disable-next-line react/jsx-key
						<li className={s.errorMessage}>{error}</li>
					))}
				</ul>
			</div>
		)
	}

	return (
		<div className={s.root}>
			<CheckboxControl
				aria-describedby={helperTextElementId}
				checked={isChecked}
				id={inputId}
				name={name}
				onChange={() => {
					setIsChecked((previouslyIsChecked: boolean) => !previouslyIsChecked)
				}}
			/>
			<Label className={s.label} htmlFor={inputId}>
				{label}
			</Label>
			{helperTextElement}
			{errorsElement}
		</div>
	)
}

export type { CheckboxFieldProps }
export default CheckboxField
