import { ReactElement } from 'react'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import { useCurrentVersion } from 'views/product-downloads-view/contexts'
import { getPageSubtitle } from 'views/product-downloads-view/helpers'
import s from './page-header.module.css'
import { ProductSlug } from 'types/products'

interface PageHeaderProps {
	isEnterpriseMode: boolean
	product: { name: string; slug: ProductSlug }
}

const PageHeader = ({
	isEnterpriseMode = false,
	product,
}: PageHeaderProps): ReactElement => {
	const { currentVersion, isLatestVersion } = useCurrentVersion()

	const pageTitle = isEnterpriseMode
		? `${product.name} Enterprise Installation`
		: `Install ${product.name}`

	const pageSubtitle = isEnterpriseMode
		? ''
		: getPageSubtitle({
				productName: product.name,
				version: currentVersion,
				isLatestVersion,
		  })

	const productSlug = (
		product.slug === 'sentinel' ? 'hcp' : product.slug
	) as Exclude<ProductSlug, 'sentinel'>

	return (
		<div className={s.root}>
			<IconTileLogo className={s.iconTileLogo} productSlug={productSlug} />
			<div>
				<Heading
					className={s.pageHeaderTitle}
					level={1}
					size={500}
					id={`install-${product.slug}`}
					weight="bold"
				>
					{pageTitle}
				</Heading>
				<Text className={s.pageHeaderSubtitle} size={300} weight="regular">
					{pageSubtitle}
				</Text>
			</div>
		</div>
	)
}

export default PageHeader
