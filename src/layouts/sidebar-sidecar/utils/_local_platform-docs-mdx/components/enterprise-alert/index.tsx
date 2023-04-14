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
	productSlug: ProductSlug
	inline?: boolean
	className?: string
	children?: ReactNode
}

export function EnterpriseAlert({
	productSlug,
	inline,
	className,
	children,
}: EnterpriseAlertProps) {
	// This ensures we aren't producing invalid HTML when rendering inline alerts within MDX. When used inline, we might end up nesting a div inside of a p. This is invalid as p cannot contain block-level elements (ref: https://www.w3.org/TR/html401/struct/text.html#h-9.3.1).
	const Element = inline ? 'span' : 'div'
	const isValidProduct = isProductSlug(productSlug)

	if (productSlug === 'hcp') {
		return null
	}

	if (!isValidProduct) {
		throw new Error(
			`[EnterpriseAlert]: Invalid product option passed. Expected one of ${Object.keys(
				productSlugsToNames
			).filter((slug) => slug !== 'hcp')}`
		)
	}

	return (
		<Element
			className={classNames(s.root, className, {
				[s.inline]: inline,
			})}
		>
			<Badge
				className={s.badge}
				icon={<ProductIcon productSlug={productSlug} />}
				text="Enterprise"
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
								href={`https://www.hashicorp.com/products/${productSlug}`}
								target="_blank"
								rel="noopener noreferrer"
								textSize={200}
							>
								{productSlugsToNames[productSlug]} Enterprise
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
	product?: ProductSlug
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
