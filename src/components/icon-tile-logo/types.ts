import { IconTileProps } from 'components/icon-tile/types'
import { ProductSlug } from 'types/products'

export interface IconTileLogoProps {
	productSlug: Exclude<ProductSlug, 'sentinel'>
	className?: string
	size?: IconTileProps['size']
}
