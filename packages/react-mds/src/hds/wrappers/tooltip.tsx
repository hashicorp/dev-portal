'use client'

import Tippy, { type TippyProps } from '@tippyjs/react'
import { followCursor, type Plugin } from 'tippy.js'
import type { ReactElement } from 'react'
import 'tippy.js/dist/svg-arrow.css'

export interface TooltipProps {
	options?: TippyProps
	children: TippyProps['children']
	text: string | ReactElement
}

export interface HideOnEsc extends Plugin {
	name: 'hideOnEsc'
	defaultValue: true
}

const hideOnEsc = {
	name: 'hideOnEsc',
	defaultValue: true,
	fn(instance: { hide: () => void }) {
		function onKeyDown(event: KeyboardEvent): void {
			if (event.key === 'Escape') {
				instance.hide()
			}
		}

		return {
			onShow() {
				document.addEventListener('keydown', onKeyDown)
			},
			onHide() {
				document.removeEventListener('keydown', onKeyDown)
			},
		}
	},
}

export const Tooltip = ({ options = {}, children, text }: TooltipProps) => {
	const plugins =
		options.followCursor !== undefined ? [hideOnEsc, followCursor] : [hideOnEsc]

	return (
		<Tippy
			theme="hds"
			arrow={`<svg
					className="hds-tooltip-pointer"
					width="16"
					height="7"
					viewBox="0 0 16 7"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M0 7H16L9.11989 0.444571C8.49776 -0.148191 7.50224 -0.148191 6.88011 0.444572L0 7Z" />
				</svg>`}
			interactive
			aria={{
				content: 'describedby',
			}}
			plugins={plugins}
			content={text}
			{...options}
		>
			{children}
		</Tippy>
	)
}
