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
	description,
	initialOpen,
	title,
	isFirstItem,
	isLastItem,
	activatorHeadingLevel,
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
	 * If both isFirstItem or isLastItem are defined, we'll style as grouped.
	 */
	const isGroupedItem =
		typeof isFirstItem !== 'undefined' && typeof isLastItem !== 'undefined'

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
					className={s.button}
					data-heap-track="accordion-disclosure-activator"
					headingLevel={activatorHeadingLevel}
					ref={hoverRef}
				>
					<span className={s.labelContainer}>
						<Text asElement="span" className={s.title} weight="semibold">
							{title}
						</Text>
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
