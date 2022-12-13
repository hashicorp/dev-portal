import { GetStaticPropsContext } from 'next'

export async function getStaticProps({
	params: { slug: rawSlug },
}: GetStaticPropsContext): Promise<{ props: { slug: string } }> {
	// Get the `slug` as a string
	const slug = Array.isArray(rawSlug) ? rawSlug.join('/') : rawSlug
	// Return static props
	return { props: { slug } }
}

export async function getStaticPaths() {
	const slugs = [
		'infrastructure-automation',
		'networking-automation',
		'security-automation',
	]
	const paths = slugs.map((slug: string) => ({ params: { slug } }))
	return { paths, fallback: false }
}
