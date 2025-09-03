import { Text } from '../../text'
import s from './form-radio-card.module.css'

export default function Description({ description }: { description: string }) {
	return (
		<Text.HDSBody className={s.description} size="100">
			{description}
		</Text.HDSBody>
	)
}
