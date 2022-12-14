import fs from 'fs'
import path from 'path'
import { GetStaticPropsContext } from 'next'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

import BaseLayout from 'layouts/base-new'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import DevDotContent from 'components/dev-dot-content'
import s from './style.module.css'

interface MessagePageProps {
	/**
	 * Represents the return value of a call to `serialize()`. The properties
	 * from this object that are passed unchanged to `MDXRemote` are
	 * `compiledSource` and `scope`.
	 */
	mdxSource: MDXRemoteSerializeResult
}

const MESSAGES_FOLDER = path.join(process.cwd(), 'src', 'content', 'messages')
const COMPONENTS = defaultMdxComponents({})

async function loadMessage(messageId: string): Promise<string | undefined> {
	const messagePath = path.join(MESSAGES_FOLDER, `${messageId}.mdx`)

	try {
		const content = String(await fs.promises.readFile(messagePath))

		return content
	} catch (err) {
		console.error('[messages] error loading message: ', messageId, err)
	}
}

function MessagePage({ mdxSource }: MessagePageProps) {
	return (
		<div className={s.root}>
			<DevDotContent className={s.content}>
				<MDXRemote {...mdxSource} components={COMPONENTS} />
			</DevDotContent>
		</div>
	)
}

export async function getStaticPaths() {
	return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
	const { messageId } = ctx.params

	const rawMessage = await loadMessage(messageId as string)

	if (!rawMessage) {
		return { notFound: true }
	}

	const mdxSource = await serialize(rawMessage)

	return {
		props: { mdxSource, metadata: { title: messageId } },
	}
}

MessagePage.layout = BaseLayout

export default MessagePage
