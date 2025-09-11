import type { Products } from '@hashicorp/platform-product-meta'
import { Badge } from '../../components/badge'
import s from './style.module.css'

interface ProductBadgeProps {
	productName: Products
	hasDot?: boolean
}

const ProductBadge = ({ productName, hasDot }: ProductBadgeProps) => {
	const finalProductName = productName.replace('hashicorp', 'HashiCorp')

	const productBrand =
		finalProductName === 'HashiCorp cloud platform' ? 'hashicorp' : productName

	return (
		<Badge
			className={s.badge}
			text={finalProductName}
			{...(hasDot && {
				icon: 'dot',
				iconColor: `var(--token-color-${productBrand}-brand)`,
			})}
		/>
	)
}

export type { ProductBadgeProps }
export { ProductBadge }
