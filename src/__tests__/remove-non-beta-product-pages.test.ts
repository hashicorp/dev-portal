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
		"🧹 removing pages at /boundary
		🧹 removing pages at /consul
		🧹 removing pages at /docs
		🧹 removing pages at /hcp
		🧹 removing pages at /nomad
		🧹 removing pages at /packer
		🧹 removing pages at /profile
		🧹 removing pages at /sentinel
		🧹 removing pages at /terraform
		🧹 removing pages at /vagrant
		🧹 removing pages at /well-architected-framework
		"
	`)
	})
})
