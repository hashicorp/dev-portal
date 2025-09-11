import type { HTMLAttributes } from 'react'
import classNames from 'classnames'
import s from './separator.module.css'

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
	spacing?: '0' | '24'
}

const Separator = ({ spacing = '24', className, ...rest }: SeparatorProps) => {
	return (
		<hr
			className={classNames(s.separator, s[`spacing-${spacing}`], className)}
			{...rest}
		/>
	)
}

export type { SeparatorProps }
export { Separator }
