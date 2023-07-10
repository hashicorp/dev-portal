/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import AccordionDisclosure from 'components/accordion-disclosure'
import s from './mdx-accordion.module.css'

interface MdxAccordionProps {
	children: ReactNode
	collapse?: 'true' | boolean
	heading: string
}

export const MdxAccordion = ({
	children,
	collapse,
	heading,
}: MdxAccordionProps) => {
	return (
		<AccordionDisclosure
			title={heading}
			className={s.accordionWrapper}
			initialOpen={!collapse}
		>
			{children}
		</AccordionDisclosure>
	)
}
