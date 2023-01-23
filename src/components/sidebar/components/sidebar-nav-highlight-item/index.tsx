import Link from 'components/link'
import classNames from 'classnames'
import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'
import s from './sidebar-nav-highlight-item.module.css'

/**
 * Render a fancy-looking, product themed linked sidebar item.
 *
 * Intended to be used as a kind of title-ish element, to establish hierarchy
 * within sidebar contents.
 */
export default function SidebarNavHighlightItem({
	theme,
	text,
	href,
}: {
	theme: ProductSlug
	text: string
	href: string
}) {
	return (
		<Link
			// aria-current={ariaCurrent}
			// aria-label={ariaLabel}
			className={classNames(s.root, s[`theme-${theme}`])}
			// data-heap-track="sidebar-nav-link-item"
			href={href}
			// opensInNewTab={isExternal}
			// rel={rel}
		>
			<ProductIcon productSlug={theme} />
			<span className={s.text}>{text}</span>
		</Link>
	)
}
