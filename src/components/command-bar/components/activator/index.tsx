import { IconCommand16 } from '@hashicorp/flight-icons/svg-react/command-16'
import Badge from 'components/badge'
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
			<span className={s.left}>
				{leadingIcon ? (
					<span className={s.leadingIcon}>{leadingIcon}</span>
				) : null}
				<Text asElement="span" className={s.text} size={200} weight="regular">
					{visualLabel}
				</Text>
			</span>
			<span className={s.right}>
				<Badge
					ariaLabel="Command key"
					color="neutral-dark-mode"
					icon={<IconCommand16 />}
					size="small"
				/>
				<Badge
					ariaLabel="K key"
					color="neutral-dark-mode"
					size="small"
					text="K"
				/>
			</span>
		</button>
	)
}

export { CommandBarActivator }
