import classNames from 'classnames'
import { LabelProps } from './types'
import s from './label.module.css'

const Label = ({
	children,
	className,
	fontWeight = 'semibold',
	htmlFor,
}: LabelProps) => {
	const classes = classNames(s.root, `hds-font-weight-${fontWeight}`, className)
	return (
		<label className={classes} htmlFor={htmlFor}>
			{children}
		</label>
	)
}

export type { LabelProps }
export default Label
