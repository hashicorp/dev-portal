/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useState } from 'react'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import { NavigationHeaderIcon } from 'components/navigation-header/types'
import { ProductSlug } from 'types/products'
import s from './sandbox-item.module.css'

interface SandboxItemProps {
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

const SandboxItem = ({ item }: SandboxItemProps) => {
	const { label, description, products, onClick, labId } = item
	const [isLaunching, setIsLaunching] = useState(false)

	const handleClick = useCallback(
		async (e) => {
			e.preventDefault()
			
			if (isLaunching) return // Prevent double clicks
			
			setIsLaunching(true)
			
			try {
				await onClick?.()
			} finally {
				// Reset loading state after a short delay to provide visual feedback
				setTimeout(() => {
					setIsLaunching(false)
				}, 1000)
			}
		},
		[onClick, isLaunching]
	)

	return (
		<a
			href="#"
			className={`${s.sandboxItem} ${isLaunching ? s.launching : ''}`}
			onClick={handleClick}
			title={isLaunching ? 'Launching lab...' : description}
			aria-disabled={isLaunching}
		>
			<div className={s.content}>
				<div className={s.titleRow}>
					<Text
						asElement="span"
						className={s.title}
						size={200}
						weight="regular"
					>
						{isLaunching ? 'Launching...' : label}
					</Text>
					{isLaunching && <div className={s.loadingSpinner} />}
					<div className={s.productIcons}>
						{products.map((product) => (
							<ProductIcon
								key={`${labId}-${product}`}
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
					{isLaunching ? 'Setting up your sandbox environment...' : description}
				</Text>
			</div>
		</a>
	)
}

export default SandboxItem
