import { Text } from '../../text'
import s from './form-radio-card.module.css'

export default function Label({ label }: { label: string }) {
	return (
		<Text.Display className={s.label} size="300" weight="bold">
			{label}
		</Text.Display>
	)
}
