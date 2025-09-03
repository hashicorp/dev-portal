'use client'

import {
	useEffect,
	useMemo,
	useState,
	useCallback,
	useId,
	type HTMLAttributes,
	PropsWithChildren,
} from 'react'
import classNames from 'classnames'
import {
	DisclosurePrimitiveContext,
	useDisclosurePrimitive,
	type DisclosurePrimitiveContextState,
} from './use-disclosure-primitive'
import s from './styles.module.css'

interface DisclosurePrimitiveProviderProps
	extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Callback fired when the disclosure is closed (optional)
	 */
	onClose?: () => void
	/**
	 * Hook into this trackedIsOpen property to access the state of isOpen
	 * @default false
	 * */
	trackedIsOpen?: boolean
	containsInteractive?: boolean
	ariaLabel?: string
}

const Provider = ({
	onClose,
	children,
	className,
	trackedIsOpen = false,
	containsInteractive = false,
	ariaLabel = 'Toggle display',
	...rest
}: DisclosurePrimitiveProviderProps) => {
	const [isOpen, setIsOpen] = useState(trackedIsOpen)
	const contentId = 'content-' + useId()

	// update the provider state if the trackedIsOpen prop changes
	useEffect(() => {
		setIsOpen(trackedIsOpen)
	}, [trackedIsOpen])

	const closeDisclosure = useCallback(() => {
		setIsOpen(false)
		if (onClose) {
			onClose()
		}
	}, [setIsOpen, onClose])

	const onClickToggle = useCallback(() => {
		setIsOpen((prevState) => !prevState)
	}, [setIsOpen])

	const contextValue: DisclosurePrimitiveContextState = useMemo(
		() => ({
			isOpen,
			onClickToggle,
			closeDisclosure,
			contentId,
			containsInteractive,
			ariaLabel,
		}),
		[
			isOpen,
			onClickToggle,
			closeDisclosure,
			contentId,
			containsInteractive,
			ariaLabel,
		]
	)

	return (
		<DisclosurePrimitiveContext.Provider value={contextValue}>
			<div
				className={classNames(s['disclosure-primitive'], className)}
				{...rest}
			>
				{children}
			</div>
		</DisclosurePrimitiveContext.Provider>
	)
}

const Content = ({ children }: PropsWithChildren) => {
	const { isOpen } = useDisclosurePrimitive()
	if (isOpen) {
		return children
	}

	return <></>
}

const DisclosurePrimitive = { Provider, Content }

export { DisclosurePrimitive }
