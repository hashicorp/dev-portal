import classNames from 'classnames'
import { Label } from '../label'
import { HelperText } from '../helper-text'
import { Error } from '../error'
import type { ReactNode } from 'react'
import s from './form-field.module.css'

interface FieldProps {
	badgeText?: string
	id: string
	isRequired?: boolean
	isOptional?: boolean
	label?: ReactNode
	helperText?: ReactNode
	error?: ReactNode
	className?: string
	layout?: 'vertical' | 'flag'
	children: ReactNode
}

const Field = ({
	badgeText,
	id,
	isRequired,
	isOptional,
	label,
	helperText,
	error,
	className,
	layout,
	children,
	...rest
}: FieldProps) => {
	return (
		<div
			className={classNames({ [s[`${layout}`]]: layout }, className)}
			{...rest}
		>
			{label && (
				<Label
					badgeText={badgeText}
					controlId={id}
					isOptional={isOptional}
					isRequired={isRequired}
					className={s.label}
				>
					{label}
				</Label>
			)}
			{helperText && (
				<HelperText controlId={id} className={s['helper-text']}>
					{helperText}
				</HelperText>
			)}
			<div className={s.control}>{children}</div>
			{error && (
				<Error controlId={id} className={s.error}>
					{error}
				</Error>
			)}
		</div>
	)
}

export type { FieldProps }
export { Field }
