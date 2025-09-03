import Link from 'next/link'
import classNames from 'classnames'
import { IconMoreHorizontal16 } from '@hashicorp/flight-icons/svg-react/more-horizontal-16'
import * as MenuPrimitive from '../menu-primitive'
import { useMenuPrimitive } from '../menu-primitive/use-menu-primitive'
import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react'
import s from './style.module.scss'

interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
	/**
	 * This controls if the Breadcrumb Items can wrap if they don’t fit within the container.
	 * @default true
	 */
	itemsCanWrap?: boolean
	/**
	 * Accepts a localized string.
	 * @default 'breadcrumbs'
	 */
	ariaLabel?: string
	/**
	 * Array of Breadcrumb.Item and/or Breadcrumb.Truncation components.
	 */
	children: ReactNode
}

const Root = ({
	itemsCanWrap = true,
	ariaLabel = 'breadcrumbs',
	children,
	className,
	...rest
}: BreadcrumbProps) => {
	return (
		<nav
			className={classNames(
				s.breadcrumbs,
				{
					[s['items-can-wrap']]: itemsCanWrap,
				},
				className
			)}
			aria-label={ariaLabel}
			{...rest}
		>
			<ol className={s.list}>{children}</ol>
		</nav>
	)
}

interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
	/**
	 * The URL to link to.
	 */
	url: string
	/**
	 * The text displayed within the item.
	 */
	text: string
	/**
	 * Use to show an flight icon.
	 */
	icon?: ReactNode
}

interface BreadcrumbItemPropsExtended extends BreadcrumbItemProps {
	/**
	 * Determines if an item is the last item in the Breadcrumb, in which case it doesn’t generate a link.
	 * @default false
	 */
	current?: boolean
	/**
	 * A parameter that can be applied to an "item" to limit its max-width
	 */
	maxWidth?: `${number}px` | `${number}em`
}

const Item = ({
	maxWidth,
	current,
	icon,
	text,
	url,
	...rest
}: BreadcrumbItemPropsExtended) => {
	return (
		<li
			className={s.item}
			style={{
				...(maxWidth && { maxWidth }),
			}}
			{...rest}
		>
			{current ? (
				<div className={s.current}>
					<ItemContent icon={icon} text={text} />
				</div>
			) : (
				<Link className={s.link} href={url}>
					<ItemContent icon={icon} text={text} />
				</Link>
			)}
		</li>
	)
}

const ItemContent = ({
	icon,
	text,
}: Pick<BreadcrumbItemProps, 'icon' | 'text'>) => {
	return (
		<>
			{icon && <div className={s.icon}>{icon}</div>}

			<span className={s.text}>{text}</span>
		</>
	)
}

interface BreadcrumbTruncationProps extends HTMLAttributes<HTMLLIElement> {
	/**
	 * Set on the truncation toggle button. Accepts a localized string.
	 * @default 'show more'
	 */
	ariaLabel?: string
	/**
	 * Array of Breadcrumb.Item components.
	 */
	children: ReactNode
}

const Truncation = ({
	ariaLabel,
	children,
	...rest
}: BreadcrumbTruncationProps) => {
	return (
		<li className={classNames(s.item, s.truncation)} {...rest}>
			<MenuPrimitive.Provider>
				<MenuPrimitive.Toggle>
					<TruncationButton />
				</MenuPrimitive.Toggle>
				<MenuPrimitive.Content>
					<div className={s['truncation-content']}>
						<ol className={s.sublist}>{children}</ol>
					</div>
				</MenuPrimitive.Content>
			</MenuPrimitive.Provider>
		</li>
	)
}

const TruncationButton = ({
	ariaLabel = 'show more',
}: {
	ariaLabel?: string
}) => {
	const { isOpen, onClickToggle } = useMenuPrimitive()

	return (
		<button
			type="button"
			className={s['truncation-button']}
			aria-label={ariaLabel}
			aria-expanded={isOpen}
			onClick={onClickToggle}
		>
			<IconMoreHorizontal16 />
		</button>
	)
}

const Breadcrumbs = { Root, Item, Truncation }

export type { BreadcrumbProps, BreadcrumbItemProps, BreadcrumbTruncationProps }
export { Breadcrumbs }
