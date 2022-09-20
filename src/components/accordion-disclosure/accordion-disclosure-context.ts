import { createContext, useContext } from 'react'

export const AccordionDisclosureContext = createContext<boolean>(false)

/**
 * should return `true` if being called by a consumer that
 * is a descendant of an accordion disclosure component
 */
export const useAccordionDisclosureContext = () => {
	return useContext(AccordionDisclosureContext)
}
