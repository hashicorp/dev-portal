import Head from 'next/head'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import { ProductSlug } from 'types/products'

interface ValidatedDesignsLandingProps {
	title: string
	description: string
	categoryGroups: HvdCategoryGroup[]
}

interface HvdCategoryGroup {
	product: ProductSlug
	title: string
	description: string
	guides: HvdGuide[]
}

interface HvdGuide {
	title: string
	description: string
	href: string
}

export default function ValidatedDesignsLandingView({
	data,
}: {
	data: $TSFixMe
}) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>HashiCorp Validated Designs</h1>
			<ul>
				{data.map((file, i) => (
					<li key={i}>
						<a href={file.path}>{file.path} </a>
					</li>
				))}
			</ul>
		</BaseLayout>
	)
}
