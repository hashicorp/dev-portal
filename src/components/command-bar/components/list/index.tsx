import { useId } from '@react-aria/utils'
import Text from 'components/text'
import { CommandBarListProps } from './types'
import s from './command-bar-list.module.css'

const CommandBarList = ({
	ariaLabelledBy,
	children,
	label,
}: CommandBarListProps) => {
	const componentId = useId()
	const labelId = ariaLabelledBy ?? `${componentId}-label`

	const hasAccessibleLabel = !!ariaLabelledBy || !!label
	if (!hasAccessibleLabel) {
		throw new Error(
			'CommandBarList requires one of: `ariaLabelledBy` or `label`.'
		)
	}

	const hasTooManyLabels = !!ariaLabelledBy && !!label
	if (hasTooManyLabels) {
		throw new Error(
			'CommandBarList was given both `ariaLabelledBy and `label`. Only provide one.'
		)
	}

	return (
		<div className={s.root}>
			{label ? (
				<Text
					asElement="p"
					className={s.label}
					id={labelId}
					size={100}
					weight="semibold"
				>
					{label}
				</Text>
			) : null}
			<ul aria-labelledby={labelId} className={s.list}>
				{children}
			</ul>
		</div>
	)
}

export type { CommandBarListProps }
export { CommandBarList }
