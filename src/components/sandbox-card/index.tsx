/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import { ProductSlug } from 'types/products'
import Card from 'components/card'
import CardTitle from 'components/card/components/card-title'
import CardDescription from 'components/card/components/card-description'
import CardFooter from 'components/card/components/card-footer'
import ButtonLink from 'components/button-link'
import ProductIcon from 'components/product-icon'
import s from './sandbox-card.module.css'

export interface SandboxCardProps {
	title: string
	description: string
	labId: string
	products: string[]
	onLaunch: () => void
	className?: string
}

const SandboxCard: React.FC<SandboxCardProps> = ({
	title,
	description,
	labId,
	products,
	onLaunch,
	className,
}) => {
	return (
		<div className={`${s.sandboxCardWrapper} ${className || ''}`}>
			<Card className={s.sandboxCard}>
				<div className={s.cardHeader}>
					<CardTitle text={title} />
					<div className={s.productIcons}>
						{products.map((productSlug) => (
							<ProductIcon
								key={`product-${labId}-${productSlug}`}
								productSlug={productSlug as ProductSlug}
								size={16}
								className={s.productIcon}
							/>
						))}
					</div>
				</div>
				<CardDescription text={description} className={s.description} />
				<CardFooter className={s.footer}>
					<ButtonLink
						href="#"
						className={s.launchButton}
						aria-label={`Launch ${title} Sandbox`}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							onLaunch()
						}}
						size="medium"
						text="Launch Sandbox"
					/>
				</CardFooter>
			</Card>
		</div>
	)
}

export default SandboxCard
