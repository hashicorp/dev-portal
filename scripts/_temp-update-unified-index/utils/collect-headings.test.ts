import { collectHeadings } from './collect-headings'

describe('collectHeadings', () => {
	it('collects headings from a basic MDX file string', async () => {
		const result = await collectHeadings(
			[
				`# Boundary Things`,
				`Hello world.`,
				`## Heading One`,
				`Hello world.`,
				`## Heading Two`,
				`Hello world.`,
				`## Heading Three`,
				`Hello world.`,
			].join('\n\n')
		)
		expect(result.length).toBe(4)
		expect(result).toEqual([
			'Boundary Things',
			'Heading One',
			'Heading Two',
			'Heading Three',
		])
	})
})
