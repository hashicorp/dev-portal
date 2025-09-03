import classNames from 'classnames'
import * as MenuPrimitive from '../menu-primitive'
import { ToggleButton } from './toggle-button'
import { ListItem } from './list-item'
import type { HTMLAttributes, ReactNode } from 'react'
import s from './styles.module.css'

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * If true, container is given full width styles. (Added by web presence team)
	 */
	isFullWidth?: boolean
	/**
	 * Callback function invoked when the Dropdown is closed, if provided.
	 */
	onClose?: () => void
}

const Root = ({
	isFullWidth,
	onClose,
	children,
	className,
	...rest
}: DropdownProps) => {
	return (
		<MenuPrimitive.Provider
			className={classNames(
				{
					[s['width-full']]: isFullWidth,
				},
				className
			)}
			onClose={onClose}
			isFullWidth={isFullWidth}
			{...rest}
		>
			{children}
		</MenuPrimitive.Provider>
	)
}

interface ContentProps {
	listPosition?:
		| 'right'
		| 'left'
		| 'bottom-left'
		| 'bottom-right'
		| 'top-left'
		| 'top-right'
	width?: `${number}px` | `${number}em` | `${number}%`
	/**
	 * If a height prop is provided then the list will have a fixed height.
	 */
	height?: `${number}px` | `${number}em`
	children: ReactNode
}

const Content = ({
	listPosition = 'bottom-right',
	width,
	height,
	children,
}: ContentProps) => {
	return (
		<MenuPrimitive.Content>
			<div
				className={classNames(
					s.content,
					s[`content-position-${listPosition}`],
					{ [s['content-fixed-width']]: !!width }
				)}
				style={{ width, height }}
			>
				{children}
			</div>
		</MenuPrimitive.Content>
	)
}

const List = ({ children }: { children: ReactNode }) => {
	return <ul className={s.list}>{children}</ul>
}

interface HeaderFooterProps extends HTMLAttributes<HTMLDivElement> {
	hasDivider?: boolean
}

const Header = ({ hasDivider, children, ...rest }: HeaderFooterProps) => {
	return (
		<div
			className={classNames(s.header, {
				[s['header-with-divider']]: hasDivider,
			})}
			{...rest}
		>
			{children}
		</div>
	)
}

const Footer = ({ hasDivider, children, ...rest }: HeaderFooterProps) => {
	return (
		<div
			className={classNames(s.footer, {
				[s['footer-with-divider']]: hasDivider,
			})}
			{...rest}
		>
			{children}
		</div>
	)
}

Root.displayName = 'Dropdown.Root'
Content.displayName = 'Dropdown.Content'
List.displayName = 'Dropdown.List'
Header.displayName = 'Dropdown.Header'
Footer.displayName = 'Dropdown.Footer'

export type { DropdownProps, ContentProps, HeaderFooterProps }
export { Root, ToggleButton, Content, List, Header, Footer, ListItem }
