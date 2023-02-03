import { ReactElement } from 'react'

type NativeDivProps = JSX.IntrinsicElements['div']

/**
 * Callback function for generating the `className` prop of the containing
 * element. Useful for specifying different class names based on the
 * open/closed state of the `Disclosure`.
 */
type GenerateContainerClassName = (
	isOpen: boolean
) => NativeDivProps['className']

interface DisclosureProps {
	/**
	 * The content of the Disclosure. Expects one `DisclosureActivator` and then
	 * one `DisclosureContent`.
	 */
	children: ReactElement[]

	/**
	 * Whether or not the `useOnEscapeKeyDown` hook should be enabled. Is not
	 * enabled by default.
	 */
	closeOnEscapeKey?: boolean

	/**
	 * Whether or not the `useOnClickOutside` hook should be enabled. Is not
	 * enabled by default.
	 */
	closeOnClickOutside?: boolean

	/**
	 * Whether or not the `useOnFocusOutside` hook should be enabled. Is not
	 * enabled by default.
	 */
	closeOnFocusOutside?: boolean

	/**
	 * Whether or not the `useOnRouteChangeStart` hook should be enabled. Is
	 * enabled by default.
	 */
	closeOnRouteChangeStart?: boolean

	/**
	 * Optional className or callback function for generating a className.
	 */
	containerClassName?: NativeDivProps['className'] | GenerateContainerClassName

	/**
	 * Optional boolean that can be used to render the `Disclosure` in the open
	 * state on initial load.
	 */
	initialOpen?: boolean
}

interface DisclosureContextState {
	closeDisclosure: () => void
	contentContainerId: string
	isOpen: boolean
	openDisclosure: () => void
	toggleDisclosure: () => void
	uniqueId: string
}

export type { DisclosureContextState, DisclosureProps }
