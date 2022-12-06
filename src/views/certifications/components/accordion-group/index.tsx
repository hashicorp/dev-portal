// import Disclosure, {
// 	DisclosureActivator,
// 	DisclosureContent,
// } from 'components/disclosure'
import AccordionDisclosure from 'components/accordion-disclosure'
import { AccordionGroupProps, AccordionItem } from './types'
import s from './accordion-group.module.css'

export function AccordionGroup({ items }: AccordionGroupProps) {
	return (
		<>
			<div className={s.root}>
				{items.map(({ title, content }: AccordionItem) => {
					return (
						<AccordionDisclosure key={title} title={title}>
							{content}
						</AccordionDisclosure>
					)
				})}
				{/* Note: using base Disclosure components may be necessary to achieve styles as spec'd. Will wait for final spec before making this call. */}
				{/* {items.map(({ title, content }: AccordionItem) => {
					return (
						<Disclosure key={title}>
							<DisclosureActivator>{title}</DisclosureActivator>
							<DisclosureContent>{content}</DisclosureContent>
						</Disclosure>
					)
				})} */}
			</div>
		</>
	)
}
