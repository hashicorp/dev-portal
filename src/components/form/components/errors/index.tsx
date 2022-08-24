import { IconAlertDiamondFill16 } from '@hashicorp/flight-icons/svg-react/alert-diamond-fill-16'
import { ErrorsProps } from './types'
import s from './errors.module.css'
import classNames from 'classnames'

const Errors = ({ className, messages = [] }: ErrorsProps) => {
	const classes = classNames(s.root, className)

	return (
		<div className={classes}>
			<IconAlertDiamondFill16 className={s.icon} />
			<ul className={s.list}>
				{messages.map((error: string) => (
					// eslint-disable-next-line react/jsx-key
					<li className={s.message}>{error}</li>
				))}
			</ul>
		</div>
	)
}

export type { ErrorsProps }
export default Errors
