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
		<div className={s.root}>
			{text}
			<br />
			{`(fancy highlight item)`}
			<br />
			{`(theme: ${theme}, href: ${href})`}
		</div>
	)
}
