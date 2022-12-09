import AccordionDisclosure from 'components/accordion-disclosure'
import type { AccordionProps, AccordionContentItem } from './types'

/**
 * Renders a group of AccordionDisclosure items.
 */
function Accordion({ className, items }: AccordionProps) {
	return (
		<div className={className}>
			{items.map((item: AccordionContentItem, idx: number) => {
				const { title, content } = item
				const isFirstItem = idx === 0
				const isLastItem = idx === items.length - 1
				return (
					<AccordionDisclosure
						key={title}
						title={title}
						isFirstItem={isFirstItem}
						isLastItem={isLastItem}
					>
						{content}
					</AccordionDisclosure>
				)
			})}
		</div>
	)
}

export default Accordion
