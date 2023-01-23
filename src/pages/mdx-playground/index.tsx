import { useState } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import BaseNewLayout from 'layouts/base-new'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import DevDotContent from 'components/dev-dot-content'
import s from './styles.module.css'
import dynamic from 'next/dynamic'

const ConfigEntryReference = dynamic(
	() => import('components/author-primitives/consul/config-entry-reference')
)

/**
 * A playground for seeing how MDX will render in Dev Dot. Goal is to support
 * testing all authoring primitives.
 *
 * @NOTE Only `ConfigEntryReference` is configured right now because that's what
 * was specifically being tested in the moment.
 */
const MdxPlayground = ({
	rawMdx,
	mdxSource: { compiledSource: _compiledSource, scope },
}: $TSFixMe) => {
	const [mdx, setMdx] = useState(rawMdx)
	const [compiledSource, setCompiledSource] = useState(_compiledSource)

	return (
		<div className={s.root}>
			<div className={s.left}>
				<h2 className={s.sectionHeading}>MDX</h2>
				<button
					onClick={() => {
						const baseUrl = process.env.VERCEL_URL
							? `https://${process.env.VERCEL_URL}`
							: 'http://localhost:3000'
						const apiRoute = new URL(
							'api/serialize-raw-mdx',
							baseUrl
						).toString()
						fetch(apiRoute, {
							method: 'POST',
							body: JSON.stringify({ rawMdx: mdx }),
						})
							.then((res) => res.json())
							.then((res) => {
								setCompiledSource(res.compiledSource)
							})
					}}
				>
					Go
				</button>
				<div className={s.box}>
					<textarea
						className={s.textarea}
						defaultValue={mdx}
						onChange={(e) => setMdx(e.target.value)}
					/>
				</div>
			</div>
			<div className={s.right}>
				<h2 className={s.sectionHeading}>Preview</h2>
				<div className={s.box}>
					<DevDotContent className={s.content}>
						<MDXRemote
							compiledSource={compiledSource}
							components={defaultMdxComponents({
								additionalComponents: { ConfigEntryReference },
							})}
							scope={scope}
						/>
					</DevDotContent>
				</div>
			</div>
		</div>
	)
}

const getStaticProps = async () => {
	const rawMdx = '## hello'
	const mdxSource = await serialize(rawMdx)

	return {
		props: {
			rawMdx,
			mdxSource,
		},
	}
}

MdxPlayground.layout = BaseNewLayout
export { getStaticProps }
export default MdxPlayground
