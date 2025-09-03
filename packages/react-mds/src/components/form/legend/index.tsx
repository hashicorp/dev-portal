import type { ReactNode } from 'react'
import classNames from 'classnames'
import { Indicator } from '../indicator'
import s from './form-legend.module.css'

interface LegendProps {
	className?: string
	isRequired?: boolean
	isOptional?: boolean
	children: ReactNode
}

const Legend = ({
	className,
	isRequired,
	isOptional,
	children,
	...rest
}: LegendProps) => {
	return (
		<legend className={classNames(s.legend, className)} {...rest}>
			<span>{children}</span>
			{isOptional || isRequired ? (
				<span className={s.badge}>
					<Indicator isRequired={isRequired} isOptional={isOptional} />
				</span>
			) : null}
		</legend>
	)
}

export { Legend }
