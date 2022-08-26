import { useState } from 'react'
import { useId } from '@react-aria/utils'
import classNames from 'classnames'
import deriveKeyEventState from 'lib/derive-key-event-state'
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

	// TODO handle wrapping through the options w/ arrow keys
	const handleKeyDown = (e, index) => {
		const { isArrowDownKey, isArrowLeftKey, isArrowRightKey, isArrowUpKey } =
			deriveKeyEventState(e)
		const lastIndex = options.length - 1
		const isFirstOption = index === 0
		const isLastOption = index === lastIndex

		if (isFirstOption && (isArrowUpKey || isArrowLeftKey)) {
			// e.preventDefault()
			// Focus and/or select the last option (probably need ref on the fieldset)
		} else if (isLastOption && (isArrowDownKey || isArrowRightKey)) {
			// e.preventDefault()
			// Focus and/or select the first option (probably need ref on the fieldset)
		}
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
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							checked={index === indexOfSelectedOption}
							helperText={isVerticalLayout ? option.helperText : undefined}
							label={option.label}
							labelFontWeight={hasLegend ? 'regular' : 'semibold'}
							name={name}
							onChange={() => setIndexOfSelectedOption(index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
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
