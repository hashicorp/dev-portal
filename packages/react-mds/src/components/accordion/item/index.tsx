'use client'

import classNames from 'classnames'
import { DisclosurePrimitive } from '../../disclosure-primitive'
import { useDisclosurePrimitive } from '../../disclosure-primitive/use-disclosure-primitive'
import type { HTMLAttributes } from 'react'
import { AccordionButton } from './button'
import s from '../style.module.scss'

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
	ariaLabel?: string
	isOpen?: boolean
	containsInteractive?: boolean
}

const AccordionItem = ({
	children,
	containsInteractive,
	isOpen,
	ariaLabel = 'Toggle display',
	...rest
}: AccordionItemProps) => {
	return (
		<DisclosurePrimitive.Provider
			className={classNames(s.item, {
				[s['contains-interactive']]: containsInteractive,
				[s['does-not-contain-interactive']]: !containsInteractive,
			})}
			trackedIsOpen={isOpen}
			containsInteractive={containsInteractive}
			ariaLabel={ariaLabel}
			{...rest}
		>
			{children}
		</DisclosurePrimitive.Provider>
	)
}

const AccordionToggle = ({ children }: React.PropsWithChildren) => {
	return (
		<div className={s.toggle}>
			<AccordionButton />
			<div
				className={classNames(
					s['toggle-content'],
					'mds-typography-display-200 token-foreground-strong mds-typography-font-weight-semibold'
				)}
			>
				{children}
			</div>
		</div>
	)
}

const AccordionContent = ({ children }: React.PropsWithChildren) => {
	const { contentId } = useDisclosurePrimitive()

	return (
		<DisclosurePrimitive.Content>
			<div
				className={classNames(
					s['content'],
					'token-typography-body-200 token-foreground-primary'
				)}
				id={contentId}
			>
				{children}
			</div>
		</DisclosurePrimitive.Content>
	)
}

export { AccordionItem, AccordionToggle, AccordionContent }
