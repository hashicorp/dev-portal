import Head from 'next/head'
import { useRouter } from 'next/router'

const useFullURL = (base: string = 'https://developer.hashicorp.com') => {
	const { asPath } = useRouter()
	return new URL(asPath, base).toString()
}

const SelfReferentialCanonicalTag = () => {
	const canonicalURL = useFullURL()
	return (
		<Head>
			<link rel="canonical" href={canonicalURL} key="canonical" />
		</Head>
	)
}

export default SelfReferentialCanonicalTag
