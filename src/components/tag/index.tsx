import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { TagProps } from './types'
import s from './tag.module.css'

const Tag = ({ text, onRemove, buttonAriaLabel }: TagProps) => {
	const buttonAriaProps = {
		...(buttonAriaLabel ? { 'aria-label': buttonAriaLabel } : {}),
	}

	return (
		<span className={s.root}>
			<button
				className={s.removeButton}
				onClick={onRemove}
				{...buttonAriaProps}
			>
				<IconX16 className={s.removeIcon} />
			</button>
			<span className={s.text}>{text}</span>
		</span>
	)
}

export type { TagProps }
export default Tag
