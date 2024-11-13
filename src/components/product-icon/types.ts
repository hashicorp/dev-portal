/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

type SvgElementProps = JSX.IntrinsicElements['svg']

export interface ProductIconProps extends SvgElementProps {
	productSlug: ProductSlug | 'hcp-vault-secrets' | 'hcp-vault-radar'
	size?: 16 | 24
}
