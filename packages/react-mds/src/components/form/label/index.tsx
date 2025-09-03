import classNames from 'classnames'
import { Indicator } from '../indicator'
import { Badge } from '../../badge'
import type { ReactNode } from 'react'
import s from './form-label.module.css'

interface LabelProps {
	badgeText?: string
	className?: string
	controlId: string
	children: ReactNode
	isRequired?: boolean
	isOptional?: boolean
}

const Label = ({
	badgeText,
	className,
	controlId,
	children,
	isRequired,
	isOptional,
	...rest
}: LabelProps) => {
	return (
		<label
			className={classNames(s.label, className)}
			htmlFor={controlId}
			{...rest}
		>
			<span>{children}</span>
			{isOptional || isRequired || badgeText ? (
				<span className={s.badges}>
					{badgeText ? <Badge size="small" text={badgeText} /> : null}
					<Indicator isRequired={isRequired} isOptional={isOptional} />
				</span>
			) : null}
		</label>
	)
}

export { Label }
