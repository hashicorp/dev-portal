import Head from 'next/head'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import { ProductSlug } from 'types/products'

export interface ValidatedDesignsLandingProps {
	title: string
	description?: string
	categoryGroups?: HvdCategoryGroup[]
	_tmp: any // TODO remove once data scaffold is complete
}

interface HvdCategoryGroup {
	product: ProductSlug
	title?: string
	slug: string
	description: string
	guides: HvdGuide[]
}

interface HvdGuide {
	title: string
	description: string
	href: string
}

export default function ValidatedDesignsLandingView({
	title,
	description,
	categoryGroups,
	_tmp,
}: ValidatedDesignsLandingProps) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>{title}</h1>
			<ul>
				{_tmp.map((file, i) => (
					<li key={i}>
						<a href={file.path}>{file.path} </a>
					</li>
				))}
			</ul>
		</BaseLayout>
	)
}
