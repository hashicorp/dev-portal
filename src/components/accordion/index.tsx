/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
			{items.map((item: AccordionContentItem, idx: number) => {
				const { title, content, initialOpen } = item
				return (
					<AccordionDisclosure
						key={title}
						title={title}
						initialOpen={initialOpen}
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
