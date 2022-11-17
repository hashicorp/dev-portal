import classNames from 'classnames'
import Link from 'components/link'
import { NavigationDisclosureLinkProps } from './types'
import s from './navigation-disclosure-link.module.css'

/**
 * Component for rendering the `<a>` elements within a
 * `NavigationDisclosureListItem`. Uses `components/link` and handles setting
 * `aria-current` based on the required `isActive` prop.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/navigationdisclosure
 */
const NavigationDisclosureLink = ({
	children,
	className,
	href,
	isActive,
}: NavigationDisclosureLinkProps) => {
	let ariaCurrent: JSX.IntrinsicElements['a']['aria-current']
	if (isActive) {
		ariaCurrent = 'page'
	}

	return (
		<Link
			aria-current={ariaCurrent}
			className={classNames(s.root, className)}
			href={href}
		>
			{children}
		</Link>
	)
}

export type { NavigationDisclosureLinkProps }
export default NavigationDisclosureLink
