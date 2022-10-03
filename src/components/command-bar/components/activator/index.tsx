import Badge from 'components/badge'
import { useCommandBar } from 'components/command-bar'
import { CmdCtrlIcon } from 'components/command-bar/components'
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
				<span className={s.leadingIcon}>{leadingIcon}</span>
				<Text asElement="span" className={s.text} size={200} weight="regular">
					{visualLabel}
				</Text>
			</span>
			<span className={s.right}>
				<Badge
					ariaLabel="Command or control key"
					className={s.keyBadge}
					color="neutral-dark-mode"
					icon={<CmdCtrlIcon />}
					size="small"
				/>
				<Badge
					ariaLabel="K key"
					className={s.keyBadge}
					color="neutral-dark-mode"
					size="small"
					text="K"
				/>
			</span>
		</button>
	)
}

export { CommandBarActivator }
