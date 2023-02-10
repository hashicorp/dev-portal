import CalloutCard from 'components/callout-card'
import { CalloutCardBlockProps } from './types'

const CalloutCardBlock = (props: CalloutCardBlockProps) => {
	return <CalloutCard {...props} />
}

export type { CalloutCardBlockProps }
export { CalloutCardBlock }
