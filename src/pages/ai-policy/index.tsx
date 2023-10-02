/**********
 * server *
 **********/
import fs from 'fs'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'

export async function getStaticProps() {
	const pathToPolicy = path.join(process.cwd(), 'src/content/ai-policy.mdx')
	const source = fs.readFileSync(pathToPolicy)
	const { content } = matter(source)
	const { compiledSource } = await serialize(content)
	return {
		props: {
			compiledSource,
		},
	}
}

/**********
 * client *
 **********/
import { MDXRemote } from 'next-mdx-remote'
import Layout from 'layouts/base-layout'
export default function AIPolicyPage({ compiledSource }) {
	return (
		<Layout>
			<div style={{ padding: 24 }}>
				<MDXRemote compiledSource={compiledSource} />
			</div>
		</Layout>
	)
}
