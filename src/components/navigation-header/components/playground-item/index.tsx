/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback } from 'react'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import { NavigationHeaderIcon } from 'components/navigation-header/types'
import { ProductSlug } from 'types/products'
import s from './playground-item.module.css'

interface PlaygroundItemProps {
	item: {
		label: string
		description: string
		icon?: NavigationHeaderIcon
		products: string[]
		path?: string
		ariaLabel?: string
		labId: string
		onClick?: () => void
	}
}

const PlaygroundItem = ({ item }: PlaygroundItemProps) => {
	const { label, description, products, onClick } = item

	const handleClick = useCallback(
		(e) => {
			e.preventDefault()
			onClick?.()
		},
		[onClick]
	)

	return (
		<a
			href="#"
			className={s.playgroundItem}
			onClick={handleClick}
			title={description}
		>
			<div className={s.content}>
				<div className={s.titleRow}>
					<Text
						asElement="span"
						className={s.title}
						size={200}
						weight="regular"
					>
						{label}
					</Text>
					<div className={s.productIcons}>
						{products.map((product, index) => (
							<ProductIcon
								key={index}
								productSlug={product as ProductSlug}
								className={s.productIcon}
								size={16}
							/>
						))}
					</div>
				</div>
				<Text
					asElement="span"
					className={s.description}
					size={100}
					weight="regular"
				>
					{description}
				</Text>
			</div>
		</a>
	)
}

export default PlaygroundItem
