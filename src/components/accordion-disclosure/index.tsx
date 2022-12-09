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
}: AccordionDisclosureProps) => {
	const [hoverRef, isHovered] = useHover<HTMLButtonElement>()

	const isNested = useAccordionDisclosureContext()
	const isGroupedItem =
		typeof isFirstItem !== 'undefined' && typeof isLastItem !== 'undefined'
	const generateContainerClassName = (isOpen: boolean) => {
		return classNames(s.root, {
			[s['root-expanded']]: isOpen,
			[s.nested]: isNested,
			[s.isHovered]: isHovered,
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
