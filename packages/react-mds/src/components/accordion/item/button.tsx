import classNames from 'classnames'
import { FlightIcon } from '../../flight-icon'
import { useDisclosurePrimitive } from '../../disclosure-primitive/use-disclosure-primitive'
import s from '../style.module.scss'

const AccordionButton = () => {
	const {
		onClickToggle,
		isOpen,
		contentId,
		containsInteractive: parentContainsInteractive,
		ariaLabel,
	} = useDisclosurePrimitive()

	console.log(s)

	return (
		<button
			type="button"
			className={classNames(s['button'], {
				[s['parent-contains-interactive']]: parentContainsInteractive,
				[s['parent-does-not-contain-interactive']]: !parentContainsInteractive,
			})}
			onClick={onClickToggle}
			aria-controls={contentId}
			aria-expanded={isOpen}
			aria-label={ariaLabel}
		>
			<FlightIcon
				name="chevron-down"
				size={24}
				isInlineBlock={false}
				className={classNames(s.icon, { [s['icon-rotate']]: isOpen })}
			/>
		</button>
	)
}

export { AccordionButton }
