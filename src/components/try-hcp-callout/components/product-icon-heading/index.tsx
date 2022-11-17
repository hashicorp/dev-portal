import InlineSvg from '@hashicorp/react-inline-svg'
import hcpLogo from '!!raw-loader!@hashicorp/mktg-logos/product/hcp/primary/black.svg'
import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'
import s from './product-icon-heading.module.css'

export interface ProductIconHeadingProps {
	productSlug: Exclude<ProductSlug, 'sentinel'>
	headingText: string
}

/**
 * A card heading component, for use in HCP callout cards.
 *
 * Note that when "hcp" is provided as the product slug, we render
 * the full HCP logo, and we render the provided headingText as visually hidden.
 */
export function ProductIconHeading({
	productSlug,
	headingText,
}: ProductIconHeadingProps) {
	if (productSlug === 'hcp') {
		return (
			<div className={s.rootHcpLogo}>
				<InlineSvg src={hcpLogo} />
				<span className="g-screen-reader-only">{headingText}</span>
			</div>
		)
	} else {
		return (
			<div className={s.rootIconText}>
				<ProductIcon productSlug={productSlug} className={s.icon} />
				<span className={s.heading}>{headingText}</span>
			</div>
		)
	}
}
