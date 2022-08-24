import classNames from 'classnames'
import Badge from 'components/badge'
import { Errors } from 'components/form/components'
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
			<legend className={s.legend}>
				{legend}
				{indicatorElement}
			</legend>
		)
	}

	let helperTextElement
	if (hasHelperText) {
		helperTextElement = <span className={s.helperText}>{helperText}</span>
	}

	let errorsElement
	if (hasErrors) {
		errorsElement = <Errors className={s.errors} messages={errors} />
	}

	return (
		<fieldset name={name} {...nativeProps} className={classNames(s.fieldset)}>
			{legendElement}
			{helperTextElement}
			<div className={s[`options--${layout}`]}>
				{options.map((option: CheckboxGroupOption, index: number) => {
					return (
						<CheckboxField
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							helperText={isVerticalLayout ? option.helperText : undefined}
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
