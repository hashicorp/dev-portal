import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'next-mdx-remote/serialize'

/**
 * Handles calling `serialize` server-side, because there is an error about the
 * `fs` module not being available client-side.
 *
 * @NOTE there is no error handling here. We should add it if we want to hold on
 * to this.
 */
export default async function serializeRawMdxHandler(
	request: NextApiRequest,
	response: NextApiResponse
) {
	const { rawMdx } = JSON.parse(request.body)
	const mdxSource = await serialize(rawMdx)

	response.status(StatusCodes.OK).json(mdxSource)
}
