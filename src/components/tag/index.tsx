import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import s from './tag.module.css'

const Tag = ({ text, onRemove }) => {
	return (
		<span className={s.root}>
			<button className={s.removeButton} onClick={onRemove}>
				<IconX16 className={s.removeIcon} />
			</button>
			<span className={s.text}>{text}</span>
		</span>
	)
}

export default Tag
