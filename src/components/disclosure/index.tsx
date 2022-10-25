// Third-party imports
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import classNames from 'classnames'
import { useId } from '@react-aria/utils'

// Global imports
import useOnClickOutside from 'hooks/use-on-click-outside'
import useOnEscapeKeyDown from 'hooks/use-on-escape-key-down'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import useOnRouteChangeStart from 'hooks/use-on-route-change-start'

// Local imports
import { DisclosureContextState, DisclosureProps } from './types'
import {
	DisclosureActivator,
	DisclosureActivatorForwardedRef,
	DisclosureActivatorProps,
	DisclosureContent,
	DisclosureContentProps,
} from './components'
import { validateDisclosureChildren } from './helpers'
import s from './disclosure.module.css'

/**
 * An internal `Context` used for storing state about a single `Disclosure`. Is
 * not intended for use outside of this file.
 */
const DisclosureContext = createContext<DisclosureContextState>(undefined)
DisclosureContext.displayName = 'DisclosureContext'

/**
 * A hook for exposing a `Disclosure`s state. Intended for use within the
 * `Disclosure` subcomponents.
 */
const useDisclosureState = (): DisclosureContextState => {
	const context = useContext(DisclosureContext)
	if (context === undefined) {
		throw new Error(
			'useDisclosureState must be used within a DisclosureContext.Provider'
		)
	}

	return context
}

/**
 * Intended to be used as an internal utility class. Maintains its open/closed
 * state, generates its own unique ID, handles closing itself when route changes
 * start, and instantiates a `DisclosureProvider`.
 *
 * Validates that has the correct children:
 *  - First, a `DisclosureActivator`
 *  - Second, a `DisclosureContent`
 *
 * @TODO possible future additions
 *  - add and invoke an `onOpen` callback when `openDisclosure` is called
 *  - add and invoke an `onClose` callback when `closeDisclosure` is called
 */
const Disclosure = ({
	children,
	closeOnClickOutside = false,
	closeOnEscapeKey = false,
	closeOnFocusOutside = false,
	containerClassName,
	initialOpen = false,
}: DisclosureProps) => {
	// check if the `children` are valid
	validateDisclosureChildren(children)

	// continue rendering the component if `children` are valid
	const disclosureRef = useRef<HTMLDivElement>()
	const [isOpen, setIsOpen] = useState<boolean>(initialOpen)
	const uniqueId = `disclosure-${useId()}`
	const contentContainerId = `${uniqueId}-content`

	// create a memoized function for opening the disclosure
	const openDisclosure = useCallback(() => {
		setIsOpen(true)
	}, [setIsOpen])

	// create a memoized function for closing the disclosure
	const closeDisclosure = useCallback(() => {
		setIsOpen(false)
	}, [setIsOpen])

	// create a memoized function for toggling the disclosure
	const toggleDisclosure = useCallback(() => {
		if (isOpen) {
			closeDisclosure()
		} else {
			openDisclosure()
		}
	}, [closeDisclosure, isOpen, openDisclosure])

	// create a memoized function for closing the disclosure on ESCAPE key down
	const handleOnEscapeKeyDown = useCallback(() => {
		// Close the disclosure
		closeDisclosure()

		// Find the associated disclosure's activator button
		const activatorButton = disclosureRef.current.querySelector(
			`button[aria-controls="${contentContainerId}"]`
		) as HTMLButtonElement

		// Re-focus the activator
		activatorButton.focus()
	}, [closeDisclosure, contentContainerId])

	// if the disclosure is open, handle closing it on `routeChangeStart`
	useOnRouteChangeStart({ handler: closeDisclosure, shouldListen: isOpen })

	// if enabled, close the disclosure on click outside
	useOnClickOutside(
		[disclosureRef],
		closeDisclosure,
		closeOnClickOutside && isOpen
	)

	// if enabled, close the disclosure on focus outside
	useOnFocusOutside(
		[disclosureRef],
		closeDisclosure,
		closeOnFocusOutside && isOpen
	)

	// if enabled, close the disclosure on ESCAPE keydown
	useOnEscapeKeyDown(
		[disclosureRef],
		handleOnEscapeKeyDown,
		closeOnEscapeKey && isOpen
	)

	// build the className prop to pass the `children` container
	const containerClasses = classNames(
		s.root,
		typeof containerClassName === 'function'
			? containerClassName(isOpen)
			: containerClassName
	)

	const providerState: DisclosureContextState = {
		closeDisclosure,
		contentContainerId,
		uniqueId,
		isOpen,
		openDisclosure,
		toggleDisclosure,
	}

	return (
		<DisclosureContext.Provider value={providerState}>
			<div className={containerClasses} ref={disclosureRef}>
				{children}
			</div>
		</DisclosureContext.Provider>
	)
}

export type {
	DisclosureActivatorForwardedRef,
	DisclosureActivatorProps,
	DisclosureContentProps,
	DisclosureProps,
}
export { DisclosureActivator, DisclosureContent, useDisclosureState }
export default Disclosure
