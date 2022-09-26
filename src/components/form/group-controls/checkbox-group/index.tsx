import { useId } from '@react-aria/utils'
import classNames from 'classnames'
import Badge from 'components/badge'
import { Errors, HelperText, Legend } from 'components/form/components'
import { CheckboxField } from 'components/form/field-controls'
import { CheckboxGroupOption, CheckboxGroupProps } from './types'
import s from './checkbox-group.module.css'

const CheckboxGroup = ({
	errors,
	helperText,
	isOptional = false,
	isRequired = false,
	layout = 'vertical',
	legend,
	name,
	options,
	...nativeProps
}: CheckboxGroupProps) => {
	const id = useId()
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
				{options.map((option: CheckboxGroupOption) => {
					return (
						<CheckboxField
							helperText={isVerticalLayout ? option.helperText : undefined}
							key={option.label}
							label={option.label}
							labelFontWeight={hasLegend ? 'regular' : 'semibold'}
							name={name}
						/>
					)
				})}
			</div>
			{errorsElement}
		</fieldset>
	)
}

export type { CheckboxGroupOption, CheckboxGroupProps }
export default CheckboxGroup
