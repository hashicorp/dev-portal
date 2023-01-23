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
	isActive,
}: {
	theme: ProductSlug
	text: string
	href: string
	isActive?: boolean
}) {
	return (
		<Link
			aria-current={isActive ? 'page' : undefined}
			className={classNames(s.root, s[`theme-${theme}`])}
			href={href}
		>
			<ProductIcon productSlug={theme} />
			<span className={s.text}>{text}</span>
		</Link>
	)
}
