import { useState } from 'react'
import { useId } from '@react-aria/utils'
import classNames from 'classnames'
import Badge from 'components/badge'
import { Legend, HelperText, Errors } from 'components/form/components'
import RadioField from 'components/form/field-controls/radio-field'
import { RadioGroupOption, RadioGroupProps } from './types'
import s from './radio-group.module.css'

const RadioGroup = ({
	errors,
	helperText,
	isOptional = false,
	isRequired = false,
	layout = 'vertical',
	legend,
	name,
	options,
	onChange = () => void 0,
	...nativeProps
}: RadioGroupProps) => {
	const id = useId()
	const [indexOfSelectedOption, setIndexOfSelectedOption] = useState<
		null | number
	>(null)
	const hasErrors = errors && errors.length > 0
	const hasHelperText = !!helperText
	const hasLegend = !!legend
	const isVerticalLayout = layout === 'vertical'

	let legendElement
	if (hasLegend) {
		let indicatorElement
		if (isRequired) {
			indicatorElement = <Badge size="small" text="Required" />
		} else if (isOptional) {
			indicatorElement = <span className={s.optionalIndicator}>(Optional)</span>
		}

		legendElement = (
			<Legend>
				{legend}
				{indicatorElement}
			</Legend>
		)
	}

	let helperTextElement, helperTextElementId
	if (hasHelperText) {
		helperTextElementId = `checkbox-group-${id}-helper-text`
		helperTextElement = (
			<HelperText className={s.helperText} id={helperTextElementId}>
				{helperText}
			</HelperText>
		)
	}

	let errorsElement
	if (hasErrors) {
		errorsElement = <Errors className={s.errors} messages={errors} />
	}

	return (
		<fieldset
			aria-describedby={helperTextElementId}
			name={name}
			{...nativeProps}
			className={classNames(s.fieldset)}
		>
			{legendElement}
			{helperTextElement}
			<div className={s[`options--${layout}`]}>
				{options.map((option: RadioGroupOption, index: number) => {
					return (
						<RadioField
							key={option.value}
							checked={index === indexOfSelectedOption}
							helperText={isVerticalLayout ? option.helperText : undefined}
							label={option.label}
							value={option.value}
							labelFontWeight={hasLegend ? 'regular' : 'semibold'}
							name={name}
							onChange={() => {
								setIndexOfSelectedOption(index)
								onChange(option.value)
							}}
						/>
					)
				})}
			</div>
			{errorsElement}
		</fieldset>
	)
}

export type { RadioGroupOption, RadioGroupProps }
export default RadioGroup
