import type { ComponentProps } from 'react'
import InteractiveLabCallout from 'components/interactive-lab-callout'

function MdxInteractiveLabCallout(
	props: ComponentProps<typeof InteractiveLabCallout>
) {
	return <InteractiveLabCallout {...props} />
}

export { MdxInteractiveLabCallout }
