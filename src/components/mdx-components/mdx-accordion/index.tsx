import AccordionDisclosure from 'components/accordion-disclosure'

/**
 * @TODO
 *   - deprecate string option for collapse
 *   - warn that collapse is `true` by default now?
 *   - pass classname with a margin-top setting for when there are multiple?
 */
function MdxAccordion({ children, collapse, heading }) {
	return <AccordionDisclosure title={heading}>{children}</AccordionDisclosure>
}

export { MdxAccordion }
