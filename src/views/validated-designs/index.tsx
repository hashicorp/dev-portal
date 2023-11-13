import Head from 'next/head'

export default function ValidatedDesignsLandingView({
	data,
}: {
	data: $TSFixMe
}) {
	console.log({ data })
	return (
		<>
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
		</>
	)
}
