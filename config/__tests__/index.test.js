/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const path = require('path')
const { loadHashiConfigForEnvironment } = require('../index')

const fixtureDir = path.join(__dirname, '__fixtures__', 'config-loading')

describe('loadHashiConfigByEnvironment', () => {
	beforeAll(() => {
		process.env.HASHI_ENV = 'production'
	})

	afterAll(() => {
		process.env.HASHI_ENV = undefined
	})

	test('loads configuration and handles extending', async () => {
		vi.spyOn(process, 'cwd').mockReturnValue(fixtureDir)
		expect(await loadHashiConfigForEnvironment()).toMatchInlineSnapshot(`
      {
        "alpha": "beta",
        "deeply.nested.another_property": false,
        "deeply.nested.property": true,
        "extends": "base",
        "flags.unified_docs_migrated_repos": [
          "terraform-mcp-server",
          "terraform-migrate",
          "terraform-plugin-framework",
          "terraform-plugin-log",
          "terraform-plugin-mux",
          "terraform-plugin-sdk",
          "terraform-plugin-testing",
          "terraform-docs-agents",
          "terraform-cdk",
          "terraform",
          "terraform-docs-common",
          "vault",
          "ptfe-releases",
          "well-architected-framework",
          "terraform-enterprise",
          "sentinel",
          "hcp-docs"
        ],
        "foo": "bar",
      }
    `)
	})
})
