const path = require('path')
const { loadHashiConfigForEnvironment } = require('../index')

const fixtureDir = path.join(__dirname, '__fixtures__', 'config-loading')

describe('loadHashiConfigByEnvironment', () => {
  let cwd = process.cwd()

  beforeAll(() => {
    process.env.HASHI_ENV = 'production'
    process.chdir(fixtureDir)
  })

  afterAll(() => {
    process.chdir(cwd)
    process.env.HASHI_ENV = undefined
  })

  test('loads configuration and handles extending', () => {
    expect(loadHashiConfigForEnvironment()).toMatchInlineSnapshot(`
      Object {
        "alpha": "beta",
        "extends": "base",
        "foo": "bar",
      }
    `)
  })
})
