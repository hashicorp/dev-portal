import classNames from 'classnames'
import type { ReactNode } from 'react'
import s from './form-helper-text.module.css'

interface HelperTextProps {
	children: ReactNode
	className?: string
	controlId?: string
}

const HelperText = ({
	children,
	className,
	controlId,
	...rest
}: HelperTextProps) => {
	return (
		<div
			className={classNames(s['helper-text'], className)}
			id={controlId ? `helper-text-${controlId}` : undefined}
			{...rest}
		>
			{children}
		</div>
	)
}

export { HelperText }
