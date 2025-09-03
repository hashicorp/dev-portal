import classNames from 'classnames'
import { Interactive } from '../interactive'
import s from './inline-link.module.css'
import { FlightIcon, FlightIconName } from '../flight-icon'

interface InlineLinkProps {
	/**
	 * There are two available colors for an `<InlineLink />`: primary and secondary.
	 */
	color?: 'primary' | 'secondary'
	/**
	 * Use this parameter to show an icon.
	 */
	icon?: FlightIconName
	/**
	 * Positions the icon before or after the text.
	 */
	iconPosition?: 'leading' | 'trailing'
	/**
	 * URL parameter that’s passed down to the `<a>` element.
	 */
	href: string
	/**
	 * Controls if the <a> link is external. For security reasons, we add the target="_blank" and rel="noopener noreferrer" attributes to it by default.
	 * default: `false`
	 */
	isHrefExternal?: boolean
	/**
	 * The content of the <a> HTML element.
	 */
	text: string
	/**
	 * Optional class name to add to the component.
	 */
	className?: string
	prefetch?: boolean
	locale?: string
}

const InlineLink = ({
	text,
	color = 'primary',
	icon,
	iconPosition = 'trailing',
	className,
	isHrefExternal,
	...props
}: InlineLinkProps) => {
	const resolvedIcon = icon || !isHrefExternal ? icon : 'external-link'
	const iconElement = resolvedIcon && (
		<FlightIcon name={resolvedIcon} size={16} className={s.icon} />
	)

	return (
		<Interactive
			className={classNames(s['link-inline'], s[`color-${color}`], className)}
			{...props}
		>
			{iconElement && iconPosition === 'leading' && iconElement}
			{text}
			{iconElement && iconPosition === 'trailing' && iconElement}
		</Interactive>
	)
}

export type { InlineLinkProps }
export { InlineLink }
