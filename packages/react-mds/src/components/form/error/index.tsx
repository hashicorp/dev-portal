import classNames from 'classnames'
import type { ReactNode } from 'react'
import { IconAlertDiamondFill16 } from '@hashicorp/flight-icons/svg-react/alert-diamond-fill-16'
import s from './form-error.module.css'

interface ErrorMessageProps {
	children: ReactNode
}

const ErrorMessage = ({ children, ...rest }: ErrorMessageProps) => {
	return (
		<p className={s.message} {...rest}>
			{children}
		</p>
	)
}

interface ErrorProps {
	children: ReactNode
	className?: string
	controlId?: string
}

const Error = ({ children, className, controlId, ...rest }: ErrorProps) => {
	return (
		<div
			className={classNames(s.error, className)}
			id={controlId ? `error-${controlId}` : undefined}
			{...rest}
		>
			<IconAlertDiamondFill16 className={s.icon} />
			<div className={s.content}>
				<ErrorMessage>{children}</ErrorMessage>
			</div>
		</div>
	)
}

export type { ErrorProps, ErrorMessageProps }
export { Error, ErrorMessage }
