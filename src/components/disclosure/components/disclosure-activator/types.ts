import { ForwardedRef } from 'react'

type DisclosureActivatorForwardedRef = ForwardedRef<HTMLButtonElement>

type NativeButtonProps = JSX.IntrinsicElements['button']

interface DisclosureActivatorProps {
	/**
	 * Optional text a screen reader will announce with the internally rendered
	 * `<button>` is brought into focus. Helpful when complex markup is rendered
	 * within the internally rendered `<button>`.
	 */
	ariaLabel?: NativeButtonProps['aria-label']

	/**
	 * Content to render within the internally rendered `<button>`.
	 */
	children: NativeButtonProps['children']

	/**
	 * Optional classes to append to the list of class names passed to the
	 * internally rendered `<button>`.
	 */
	className?: NativeButtonProps['className']

	/**
	 * Optional data-heap-track attribute to add to the
	 * internally rendered `<button>`.
	 */
	'data-heap-track'?: string
}

export type { DisclosureActivatorForwardedRef, DisclosureActivatorProps }
