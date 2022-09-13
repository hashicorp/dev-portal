import { useId } from '@react-aria/utils'
import Text from 'components/text'
import { CommandBarListProps } from './types'
import s from './command-bar-list.module.css'

const CommandBarList = ({ children, label }: CommandBarListProps) => {
	const componentId = useId()
	const labelId = `${componentId}-label`

	return (
		<div className={s.root}>
			<Text asElement="p" className={s.label} size={100} weight="semibold">
				{label}
			</Text>
			<ul aria-labelledby={labelId} className={s.list}>
				{children}
			</ul>
		</div>
	)
}

export type { CommandBarListProps }
export { CommandBarList }
