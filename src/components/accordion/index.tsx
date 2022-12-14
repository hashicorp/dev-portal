import classNames from 'classnames'
import AccordionDisclosure from 'components/accordion-disclosure'
import type { AccordionProps, AccordionContentItem } from './types'
import s from './accordion.module.css'

/**
 * Renders a group of AccordionDisclosure items.
 */
function Accordion({ className, items }: AccordionProps) {
	const itemsCount = items.length
	return (
		<div className={classNames(s.root, className)}>
			{items.map(({ title, content }: AccordionContentItem, idx: number) => {
				return (
					<AccordionDisclosure
						key={title}
						title={title}
						groupData={{
							numItems: itemsCount,
							currentIndex: idx,
						}}
					>
						{content}
					</AccordionDisclosure>
				)
			})}
		</div>
	)
}

export default Accordion
