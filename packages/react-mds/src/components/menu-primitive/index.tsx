'use client'

import {
	useMemo,
	useState,
	useRef,
	useCallback,
	type ReactNode,
	type FocusEvent,
	type KeyboardEvent,
	type HTMLAttributes,
} from 'react'
import classNames from 'classnames'
import {
	MenuPrimitiveContext,
	useMenuPrimitive,
	type MenuPrimitiveContextState,
} from './use-menu-primitive'
import s from './styles.module.css'

interface MenuPrimitiveProps extends HTMLAttributes<HTMLDivElement> {
	onClose?: () => void
	isFullWidth?: boolean
	children: ReactNode
}

const Provider = ({
	onClose,
	isFullWidth,
	children,
	className,
	...rest
}: MenuPrimitiveProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement | null>(null)
	const toggleRef = useRef<HTMLDivElement | null>(null)

	const closeMenu = useCallback(() => {
		setIsOpen(false)
		if (onClose) {
			onClose()
		}
	}, [setIsOpen, onClose])

	const onClickToggle = useCallback(() => {
		setIsOpen((prevState) => !prevState)
		toggleRef?.current?.focus()
	}, [toggleRef, setIsOpen])

	const onFocusOut = useCallback(
		(event: FocusEvent) => {
			if (
				!menuRef?.current?.contains(
					event.relatedTarget || document.activeElement
				)
			) {
				closeMenu()
			}
		},
		[closeMenu]
	)

	const onKeyUp = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeMenu()
				toggleRef?.current?.querySelector('button')?.focus()
			}
		},
		[closeMenu]
	)

	const contextValue: MenuPrimitiveContextState = useMemo(
		() => ({
			isOpen,
			onClickToggle,
			toggleRef,
			closeMenu,
		}),
		[isOpen, onClickToggle, toggleRef, closeMenu]
	)

	return (
		<MenuPrimitiveContext.Provider value={contextValue}>
			<div
				className={classNames(
					s['menu-primitive'],
					{
						[s['width-full']]: isFullWidth,
					},
					className
				)}
				onBlur={onFocusOut}
				onKeyUp={onKeyUp}
				ref={menuRef}
				{...rest}
			>
				{children}
			</div>
		</MenuPrimitiveContext.Provider>
	)
}

const Toggle = ({ children }: { children: ReactNode }) => {
	const { toggleRef } = useMenuPrimitive()
	return (
		<div className="hds-menu-primitive__toggle" ref={toggleRef}>
			{children}
		</div>
	)
}

const Content = ({ children }: { children: ReactNode }) => {
	const { isOpen } = useMenuPrimitive()
	if (isOpen) {
		return (
			<div className="hds-menu-primitive__content" tabIndex={-1}>
				{children}
			</div>
		)
	}

	return <></>
}

export { Provider, Toggle, Content }
