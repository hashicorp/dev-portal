import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import { type FeedbackFormProps } from '../../types'

import s from './finished.module.css'

const Finished: React.FC<{ text: FeedbackFormProps['finishedText'] }> = ({
	text,
}: {
	text: FeedbackFormProps['finishedText']
}) => (
	<div className={s.finished}>
		<IconCheckCircle24 color="var(--token-color-foreground-success-on-surface)" />
		{text}
	</div>
)

export { Finished }
