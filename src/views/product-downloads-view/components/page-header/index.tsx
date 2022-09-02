import { ReactElement } from 'react'
import { useCurrentProduct } from 'contexts'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import { useCurrentVersion } from 'views/product-downloads-view/contexts'
import { getPageSubtitle } from 'views/product-downloads-view/helpers'
import s from './page-header.module.css'

interface PageHeaderProps {
	isEnterpriseMode: boolean
}

const PageHeader = ({
	isEnterpriseMode = false,
}: PageHeaderProps): ReactElement => {
	const currentProduct = useCurrentProduct()
	const { currentVersion, isLatestVersion } = useCurrentVersion()
	const pageTitle = isEnterpriseMode
		? `${currentProduct.name} Enterprise Installation`
		: `Install ${currentProduct.name}`
	const pageSubtitle = isEnterpriseMode
		? ''
		: getPageSubtitle({
				productName: currentProduct.name,
				version: currentVersion,
				isLatestVersion,
		  })

	return (
		<div className={s.root}>
			<IconTileLogo
				className={s.iconTileLogo}
				productSlug={
					currentProduct.slug === 'sentinel' ? 'hcp' : currentProduct.slug
				}
			/>
			<div>
				<Heading
					className={s.pageHeaderTitle}
					level={1}
					size={500}
					id={`install-${currentProduct.slug}`}
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
