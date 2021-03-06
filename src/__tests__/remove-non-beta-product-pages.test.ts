import { execFileSync } from 'child_process'

describe('remove-non-beta-product-pages', () => {
	test('only removes expected page directories', () => {
		let stdout = String(
			execFileSync(
				'npx',
				['hc-tools', './scripts/remove-non-beta-product-pages.ts'],
				{
					env: {
						...process.env,
						HASHI_ENV: 'production',
						CI: '1',
						DRY_RUN: '1',
					},
				}
			)
		)

		// Ignore output that contains a machine-specific path
		stdout = stdout.split('\n').slice(1).join('\n')

		expect(stdout).toMatchInlineSnapshot(`
		"??完 removing pages at /boundary
		??完 removing pages at /consul
		??完 removing pages at /docs
		??完 removing pages at /hcp
		??完 removing pages at /nomad
		??完 removing pages at /packer
		??完 removing pages at /sentinel
		??完 removing pages at /terraform
		??完 removing pages at /vagrant
		"
	`)
	})
})
