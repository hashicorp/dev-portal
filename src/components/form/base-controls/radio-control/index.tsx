import classNames from 'classnames'
import { RadioControlProps } from './types'
import s from './radio-control.module.css'

const RadioControl = ({
	'aria-describedby': ariaDescribedBy,
	checked = false,
	className,
	id,
	name,
	onChange,
	onClick,
	onKeyDown,
	value,
}: RadioControlProps) => {
	const classes = classNames(s.root, className)

	return (
		<input
			aria-describedby={ariaDescribedBy}
			checked={checked}
			className={classes}
			id={id}
			name={name}
			onChange={onChange}
			onClick={onClick}
			onKeyDown={onKeyDown}
			type="radio"
			value={value || id}
		/>
	)
}

export type { RadioControlProps }
export default RadioControl
