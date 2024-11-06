/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ReactNode } from 'react'
import classNames from 'classnames'

import { useCurrentProduct } from 'contexts'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import InlineLink from 'components/inline-link'
import { ProductSlug } from 'types/products'
import { isProductSlug, productSlugsToNames } from 'lib/products'
import s from './enterprise-alert.module.css'

interface EnterpriseAlertProps {
	productSlug: ProductSlug | 'vault-secrets' | 'vault-radar'
	inline?: boolean
	className?: string
	children?: ReactNode
	badgeText?: string
}

export function EnterpriseAlert({
	productSlug,
	inline,
	className,
	children,
	badgeText,
}: EnterpriseAlertProps) {
	// This ensures we aren't producing invalid HTML when rendering inline alerts within MDX. When used inline, we might end up nesting a div inside of a p. This is invalid as p cannot contain block-level elements (ref: https://www.w3.org/TR/html401/struct/text.html#h-9.3.1).
	const Element = inline ? 'span' : 'div'
	const isValidProduct =
		isProductSlug(productSlug) ||
		productSlug === 'vault-radar' ||
		productSlug === 'vault-secrets'

	if (productSlug === 'hcp') {
		return null
	}

	const productNames = {
		...productSlugsToNames,
		'vault-secrets': 'Vault Secrets',
		'vault-radar': 'Vault radar',
	}

	if (!isValidProduct) {
		throw new Error(
			`[EnterpriseAlert]: Invalid product option passed. Expected one of ${Object.keys(
				productNames
			).filter((slug) => slug !== 'hcp')}`
		)
	}

	const href =
		productSlug === 'vault-radar' || productSlug === 'vault-secrets'
			? `https://www.hashicorp.com/products/vault/hcp-${productSlug}`
			: `https://www.hashicorp.com/products/${productSlug}`

	return (
		<Element
			className={classNames(s.root, className, {
				[s.inline]: inline,
			})}
		>
			<Badge
				className={s.badge}
				icon={<ProductIcon productSlug={productSlug} />}
				text={badgeText ? badgeText : 'Enterprise'}
				type="outlined"
				size="medium"
			/>
			{!inline && (
				<Text size={200} className={s.text}>
					{children ? (
						children
					) : (
						<>
							This feature requires{' '}
							<InlineLink
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								textSize={200}
							>
								{productNames[productSlug]} Enterprise
							</InlineLink>
							.
						</>
					)}
				</Text>
			)}
		</Element>
	)
}

type DocsEnterpriseAlertProps = Omit<EnterpriseAlertProps, 'productSlug'> & {
	product?: ProductSlug | 'vault-secrets' | 'vault-radar'
}

export function DocsEnterpriseAlert(props: DocsEnterpriseAlertProps) {
	const currentProduct = useCurrentProduct()
	return (
		<EnterpriseAlert
			productSlug={props.product || currentProduct.slug}
			{...props}
		/>
	)
}
