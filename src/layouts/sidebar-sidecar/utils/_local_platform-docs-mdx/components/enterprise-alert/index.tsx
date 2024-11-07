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
	product: ProductSlug | 'hcp-vault-secrets' | 'hcp-vault-radar'
	inline?: boolean
	className?: string
	children?: ReactNode
	badgeText?: string
}

export function EnterpriseAlert({
	product,
	inline,
	className,
	children,
	badgeText,
}: EnterpriseAlertProps) {
	// This ensures we aren't producing invalid HTML when rendering inline alerts within MDX. When used inline, we might end up nesting a div inside of a p. This is invalid as p cannot contain block-level elements (ref: https://www.w3.org/TR/html401/struct/text.html#h-9.3.1).
	const Element = inline ? 'span' : 'div'
	const isVaultSecretsOrRadar =
		product === 'hcp-vault-radar' || product === 'hcp-vault-secrets'
	const isValidProduct = isProductSlug(product) || isVaultSecretsOrRadar

	if (product === 'hcp') {
		return null
	}

	const productNames = {
		...productSlugsToNames,
		'hcp-vault-secrets': 'HCP Vault Secrets',
		'hcp-vault-radar': 'HCP Vault Radar',
	}

	if (!isValidProduct) {
		throw new Error(
			`[EnterpriseAlert]: Invalid product option passed. Expected one of ${Object.keys(
				productNames
			).filter((slug) => slug !== 'hcp')}`
		)
	}

	const href = isVaultSecretsOrRadar
		? `https://www.hashicorp.com/products/vault/${product}`
		: `https://www.hashicorp.com/products/${product}`

	const plusOrEnterprise = isVaultSecretsOrRadar ? 'Plus' : 'Enterprise'

	return (
		<Element
			className={classNames(s.root, className, {
				[s.inline]: inline,
			})}
		>
			<Badge
				className={s.badge}
				icon={<ProductIcon productSlug={product} />}
				text={badgeText ? badgeText : plusOrEnterprise}
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
								{productNames[product]} {plusOrEnterprise}
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
	product?: ProductSlug | 'hcp-vault-secrets' | 'hcp-vault-radar'
}

export function DocsEnterpriseAlert(props: DocsEnterpriseAlertProps) {
	const currentProduct = useCurrentProduct()
	return (
		<EnterpriseAlert
			product={props.product || currentProduct.slug}
			{...props}
		/>
	)
}
