export default function VariantPage({ variant }) {
	return (
		<>
			<h1>Variants with query params</h1>
			<p>
				Showcase how we can implement specifying variants with query params
				powered by rewrites.
			</p>
			<h2>Variant data</h2>
			<pre>{variant}</pre>
			<h2>Rendered path</h2>
			<pre>/variants/{variant}</pre>
		</>
	)
}

/**
 * The static paths here would be determined based on the variants configuration for a given tutorial.
 * We would generate all possible variant combinations for pre-rendering
 */
export function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	}
}

export async function getStaticProps(ctx) {
	return {
		props: {
			variant: ctx.params.variant,
		},
	}
}
