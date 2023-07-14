/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { createContext, useContext } from 'react'

export const AccordionDisclosureContext = createContext<boolean>(false)
AccordionDisclosureContext.displayName = 'AccordionDisclosureContext'

/**
 * should return `true` if being called by a consumer that
 * is a descendant of an accordion disclosure component
 */
export const useAccordionDisclosureContext = () => {
	console.log('testing')
	return useContext(AccordionDisclosureContext)
}
