import classNames from 'classnames'
import AccordionDisclosure from 'components/accordion-disclosure'
import type { AccordionProps, AccordionContentItem } from './types'
import s from './accordion.module.css'

/**
 * Renders a group of AccordionDisclosure items.
 */
function Accordion({
	className,
	items,
	activatorHeadingLevel,
}: AccordionProps) {
	return (
		<div className={classNames(s.root, className)}>
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
						activatorHeadingLevel={activatorHeadingLevel}
					>
						{content}
					</AccordionDisclosure>
				)
			})}
		</div>
	)
}

export default Accordion
