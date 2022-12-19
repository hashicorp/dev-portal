import classNames from 'classnames'
import { HelperTextProps } from './types'
import s from './helper-text.module.css'

const HelperText = ({ children, className, id }: HelperTextProps) => {
	const classes = classNames(s.root, className)

	return (
		<span className={classes} id={id}>
			{children}
		</span>
	)
}

export type { HelperTextProps }
export default HelperText
