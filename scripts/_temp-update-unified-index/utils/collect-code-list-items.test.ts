import { collectCodeListItems } from './collect-code-list-items'

describe('collectCodeListItems', () => {
	it('collects code list items from a basic MDX file string', async () => {
		const result = await collectCodeListItems(
			[
				`# Boundary Things`,
				'',
				`Hello world.`,
				'',
				'- `hey`',
				'- `here`',
				'- `be`',
				'- `code`',
			].join('\n\n')
		)
		expect(result.length).toBe(4)
		expect(result).toEqual(['hey', 'here', 'be', 'code'])
	})
})
