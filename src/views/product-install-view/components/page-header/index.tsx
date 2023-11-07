/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import VersionContextSwitcher, {
	VersionContextSwitcherProps,
} from 'components/version-context-switcher'
import { ChangeEvent, ReactElement } from 'react'
import { ProductSlug } from 'types/products'
import { useCurrentVersion } from 'views/product-install-view/contexts'
import s from './page-header.module.css'

interface PageHeaderProps {
	isEnterpriseMode: boolean
	product: { name: string; slug: ProductSlug }
	versionSwitcherOptions: VersionContextSwitcherProps['options']
}

const PageHeader = ({
	isEnterpriseMode = false,
	product,
	versionSwitcherOptions,
}: PageHeaderProps): ReactElement => {
	const { setCurrentVersion } = useCurrentVersion()

	const pageTitle = isEnterpriseMode
		? `${product.name} Enterprise Installation`
		: `Install ${product.name}`

	const productSlug = (
		product.slug === 'sentinel' ? 'hcp' : product.slug
	) as Exclude<ProductSlug, 'sentinel'>

	return (
		<div className={s.root}>
			<div className={s.headingWrapper}>
				<IconTileLogo className={s.iconTileLogo} productSlug={productSlug} />
				<Heading
					className={s.pageHeaderTitle}
					level={1}
					size={600}
					id={`install-${product.slug}`}
					weight="bold"
				>
					{pageTitle}
				</Heading>
			</div>
			<VersionContextSwitcher
				onChange={(e: ChangeEvent<HTMLSelectElement>) =>
					setCurrentVersion(e.target.value)
				}
				options={versionSwitcherOptions}
			/>
		</div>
	)
}

export default PageHeader
