import classNames from 'classnames'
import { useId } from 'react'
import { Legend } from '../legend'
import { HelperText } from '../helper-text'
import { Error } from '../error'
import type { ReactNode } from 'react'
import s from './form-fieldset.module.css'

interface FieldsetProps {
	isRequired?: boolean
	isOptional?: boolean
	legend?: ReactNode
	helperText?: ReactNode
	error?: ReactNode
	className?: string
	layout?: 'vertical' | 'horizontal'
	children: ReactNode
	id?: string
	testingKey?: string
}

const Fieldset = ({
	isRequired,
	isOptional,
	legend,
	helperText,
	error,
	className,
	layout,
	children,
	id,
	testingKey,
	...rest
}: FieldsetProps) => {
	const generatedId = useId()
	const fieldsetId = id ?? generatedId

	return (
		<fieldset
			className={classNames(s.group, layout ? s[layout] : null, className)}
			id={fieldsetId}
			data-testid={testingKey}
			{...rest}
		>
			{legend && (
				<Legend
					isOptional={isOptional}
					isRequired={isRequired}
					className={s.legend}
				>
					{legend}
				</Legend>
			)}
			{helperText && (
				<HelperText
					controlId={`${fieldsetId}-help`}
					className={s['helper-text']}
				>
					{helperText}
				</HelperText>
			)}
			<div
				className={classNames(s['control-fields-wrapper'], {
					[s['has-legend']]: legend,
				})}
			>
				{children}
			</div>
			{error && (
				<Error controlId={`${fieldsetId}-error`} className={s.error}>
					{error}
				</Error>
			)}
		</fieldset>
	)
}

export type { FieldsetProps }
export { Fieldset }
