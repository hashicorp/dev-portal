import CalloutCard from 'components/callout-card'
import { CalloutCardBlockProps } from './types'

const CalloutCardBlock = ({
	body,
	ctas,
	heading,
	headingSlug,
}: CalloutCardBlockProps) => {
	return (
		<CalloutCard
			body={body}
			ctas={ctas}
			heading={heading}
			headingSlug={headingSlug}
		/>
	)
}

export type { CalloutCardBlockProps }
export { CalloutCardBlock }
