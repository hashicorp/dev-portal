import { reporter } from 'vfile-reporter'
import { remark } from 'remark'
import noPaddedNodesRule from '../remark-rules/no-padded-nodes/index.js'

main()

async function main() {
	const file = await remark()
		.use(noPaddedNodesRule, ['error'])
		.process(
			[
				'[regular link ](/regular/link )',
				'[ link reference][link-reference]',
				'[link-reference]: /link/reference ',
				'![image alt ](/img/src)',
				'[This is a limitation of MDX also pointed out by the Docusaurus folks 🔗 ](https://v2.docusaurus.io/docs/markdown-features/#multi-language-support-code-blocks)',
			].join('/n')
		)
	const reporterResult = reporter(file)
	if (reporterResult !== 'no issues found') {
		console.error(reporterResult)
	}
}
