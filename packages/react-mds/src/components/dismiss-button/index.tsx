import classNames from 'classnames'
import { FlightIcon } from '../flight-icon'
import s from './styles.module.scss'

interface DismissButtonProps {
	ariaLabel?: string
	onClick: React.MouseEventHandler<HTMLButtonElement>
	className?: string
}

const DismissButton = ({
	ariaLabel = 'Dismiss',
	onClick,
	className,
}: DismissButtonProps) => {
	return (
		<button
			className={classNames(s['dismiss-button'], className)}
			type="button"
			aria-label={ariaLabel}
			onClick={onClick}
		>
			<FlightIcon size={16} name="x" />
		</button>
	)
}

export type { DismissButtonProps }
export { DismissButton }
