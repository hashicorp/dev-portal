import { useCommandBar } from 'components/command-bar'
import Text from 'components/text'
import { CommandBarActivatorProps } from './types'
import s from './command-bar-activator.module.css'

const CommandBarActivator = ({
	leadingIcon,
	visualLabel,
}: CommandBarActivatorProps) => {
	const { toggleIsOpen } = useCommandBar()

	return (
		<button
			aria-label={visualLabel}
			className={s.root}
			onClick={() => toggleIsOpen()}
		>
			{leadingIcon ? (
				<span className={s.leadingIcon}>{leadingIcon}</span>
			) : null}
			<Text asElement="span" className={s.text} size={200} weight="regular">
				{visualLabel}
			</Text>
		</button>
	)
}

export { CommandBarActivator }
