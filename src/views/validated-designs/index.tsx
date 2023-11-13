import Head from 'next/head'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'

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
