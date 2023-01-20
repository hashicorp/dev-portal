import ProductIcon from 'components/product-icon'
import { isProductSlug } from 'lib/products'
import s from './product-icon-text-lockup.module.css'

export interface ProductIconTextLockupProps {
	slug: string
	name: string
}

/**
 * Render a logo-like lockup of a product icon, plus the product name.
 */
export function ProductIconTextLockup({
	name,
	slug,
}: ProductIconTextLockupProps) {
	return (
		<div className={s.root}>
			{/* Note: we don't render an icon for HCP, even if we have one */}
			{isProductSlug(slug) && slug !== 'hcp' ? (
				<ProductIcon productSlug={slug} className={s.icon} />
			) : null}
			<span className={s.text}>{name}</span>
		</div>
	)
}
