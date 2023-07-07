import AccordionDisclosure from 'components/accordion-disclosure'
import s from './mdx-accordion.module.css'

/**
 * @TODO
 *   - deprecate string option for collapse
 *   - warn that collapse is `true` by default now?
 */
export const MdxAccordion = ({ children, collapse, heading }) => {
	return (
		<AccordionDisclosure title={heading} className={s.accordionWrapper}>
			{children}
		</AccordionDisclosure>
	)
}
