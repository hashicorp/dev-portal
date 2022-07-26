import classNames from 'classnames'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import Button from 'components/button'
import { useDisclosureState } from 'components/disclosure'
import disclosureStyles from 'components/disclosure/disclosure.module.css'

const DropdownDisclosureActivator = ({
	'aria-label': ariaLabel,
	children,
	className,
	hideChevron = false,
}: $TSFixMe) => {
	const { contentContainerId, isOpen, toggleDisclosure } = useDisclosureState()

	const buttonProps = {
		'aria-controls': contentContainerId,
		'aria-expanded': isOpen,
		'aria-label': ariaLabel,
		className: classNames(disclosureStyles.activator, className),
		onClick: toggleDisclosure,
	}

	if (typeof children === 'string') {
		return (
			<Button
				{...buttonProps}
				icon={hideChevron ? null : <IconChevronDown16 />}
				iconPosition={hideChevron ? undefined : 'trailing'}
				text={children}
			/>
		)
	} else {
		return <button {...buttonProps}>{children}</button>
	}
}

export default DropdownDisclosureActivator
