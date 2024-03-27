'use server'
import { serialize } from 'lib/next-mdx-remote/serialize'

export async function compileMdx(
	prevState: { compiledSource: string; error: string | null },
	formData: FormData
) {
	const source = formData.get('source') as string
	try {
		const { compiledSource } = await serialize(source)
		return { compiledSource }
	} catch (err) {
		return {
			error: err.message.replace(
				/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
				''
			),
		}
	}
}
