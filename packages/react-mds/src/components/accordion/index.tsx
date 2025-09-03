import type { HTMLAttributes } from 'react'
import classNames from 'classnames'
import s from './style.module.scss'

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * optional class name to add to the accordion
	 */
	className?: string
}

const Accordion = ({ children, className, ...rest }: AccordionProps) => {
	return (
		<div className={classNames(s.accordion, className)} {...rest}>
			{children}
		</div>
	)
}

export { Accordion }
export type { AccordionProps }
export { AccordionContent, AccordionItem, AccordionToggle } from './item'
