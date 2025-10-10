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

	test('loads configuration and handles extending', () => {
		vi.spyOn(process, 'cwd').mockReturnValue(fixtureDir)
		expect(loadHashiConfigForEnvironment()).toMatchInlineSnapshot(`
      {
        "alpha": "beta",
        "deeply.nested.another_property": false,
        "deeply.nested.property": true,
        "extends": "base",
        "foo": "bar",
      }
    `)
	})
})
