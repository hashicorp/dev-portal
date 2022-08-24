import classNames from 'classnames'
import { CheckboxControlProps } from './types'
import s from './checkbox-control.module.css'

const CheckboxControl = ({
	'aria-describedby': ariaDescribedBy,
	checked = false,
	className,
	id,
	name,
	onChange,
	value,
}: CheckboxControlProps) => {
	const classes = classNames(s.root, className)

	return (
		<input
			aria-describedby={ariaDescribedBy}
			checked={checked}
			className={classes}
			id={id}
			name={name}
			onChange={onChange}
			type="checkbox"
			value={value || id}
		/>
	)
}

export type { CheckboxControlProps }
export default CheckboxControl
