/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconChevronRight24 } from '@hashicorp/flight-icons/svg-react/chevron-right-24'
import Disclosure, {
	DisclosureActivator,
	DisclosureContent,
} from 'components/disclosure'
import Text from 'components/text'
import { AccordionDisclosureProps } from './types'
import s from './accordion-disclosure.module.css'
import {
	useAccordionDisclosureContext,
	AccordionDisclosureContext,
} from './accordion-disclosure-context'
import useHover from 'hooks/use-hover'

const AccordionDisclosure = ({
	children,
	className,
	description,
	initialOpen,
	title,
	groupData,
}: AccordionDisclosureProps) => {
	/**
	 * Note: useHover is used here to allow us to change the styling
	 * of the outer `root` container component when the `<button />`
	 * within, which is the functional interactive element, is hovered.
	 *
	 * Since we're changing styles on an ancestor node of the `<button />`
	 * whose `:hover` state we want to track, this is not as feasible
	 * with pure CSS.
	 */
	const [hoverRef, isHovered] = useHover<HTMLButtonElement>()
	const isNested = useAccordionDisclosureContext()

	/**
	 * Set up variables related to group styling.
	 */
	const isGroupedItem = typeof groupData !== 'undefined'
	const isFirstItem = groupData?.currentIndex === 0
	const isLastItem = groupData?.currentIndex === groupData?.numItems - 1

	/**
	 * Container classNames include styles for open & hovered states,
	 * as well as styling based on nesting, and based on grouping with
	 * adjacent AccordionDisclosure items.
	 */
	const generateContainerClassName = (isOpen: boolean) => {
		return classNames(s.root, {
			[s.isOpen]: isOpen,
			[s.isHovered]: isHovered,
			[s.isNested]: isNested,
			[s.isFirstItem]: isFirstItem,
			[s.isLastItem]: isLastItem,
			[s.isGroupedItem]: isGroupedItem,
		})
	}

	return (
		<AccordionDisclosureContext.Provider value={true}>
			<Disclosure
				containerClassName={generateContainerClassName}
				initialOpen={initialOpen}
			>
				<DisclosureActivator
					className={classNames(s.button, className)}
					data-heap-track="accordion-disclosure-activator"
					ref={hoverRef}
				>
					<span className={s.labelContainer}>
						{typeof title === 'string' ? (
							<Text asElement="span" className={s.title} weight="semibold">
								{title}
							</Text>
						) : (
							title
						)}
						{description && (
							<Text asElement="span" className={s.description} size={200}>
								{description}
							</Text>
						)}
					</span>
					<IconChevronRight24 />
				</DisclosureActivator>
				<DisclosureContent className={s.content}>{children}</DisclosureContent>
			</Disclosure>
		</AccordionDisclosureContext.Provider>
	)
}

export type { AccordionDisclosureProps }
export default AccordionDisclosure
