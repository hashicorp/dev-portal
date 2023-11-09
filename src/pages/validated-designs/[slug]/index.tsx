import Head from 'next/head'

export default function ValidatedDesignPageTemplate() {
	return (
		<>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>HashiCorp Validated Design Page Template</h1>
		</>
	)
}

export async function getStaticPaths() {
	return { paths: [], fallback: false }
}

export async function getStaticProps() {
	if (__config.flags.enable_hvd === false) {
		return {
			notFound: true,
		}
	}
	return {
		props: {},
	}
}
