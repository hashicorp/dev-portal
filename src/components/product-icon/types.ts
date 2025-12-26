/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

type SvgElementProps = JSX.IntrinsicElements['svg']

export interface ProductIconProps extends SvgElementProps {
	productSlug: ProductSlug | 'hcp-vault-secrets' | 'hcp-vault-radar'
	size?: 16 | 24
}
