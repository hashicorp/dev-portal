import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import ImageConfig from '.'

const testImage = (
  <img alt="hashicorp logo" src="/img/favicons/favicon-192x192.png" />
)

/**
 * this is an approximation of this component's markup when used within an MDX document, eg:
 * <ImageConfig>
 *
 *   ![hashicorp logo](/img/favicons/favicon-192x192.png)
 *
 * </ImageConfig>
 */
const renderBasicMock = () =>
  render(
    <ImageConfig hideBorder>
      <p className="g-type-long-body">{testImage}</p>
    </ImageConfig>
  )

describe('basic functionality', () => {
  //  silence console.warn
  const mockConsoleWarn = jest.spyOn(console, 'warn')
  beforeAll(() => mockConsoleWarn.mockImplementation(() => null))
  afterAll(() => mockConsoleWarn.mockRestore())

  it('should render children', () => {
    render(<ImageConfig>{testImage}</ImageConfig>)

    expect(screen.getByAltText('hashicorp logo')).toBeInTheDocument()
  })

  it('should apply `noBorder` styling if `hideBorder` is provided', () => {
    renderBasicMock()
    const mdxImgContainer = screen.getByAltText('hashicorp logo').parentNode
    expect(mdxImgContainer).toHaveClass('noBorder')
  })
})

describe('warnings', () => {
  //  mock console.warn so we can test it
  let mockStdout: string[] = []
  const mockConsoleWarn = (out: string) => mockStdout.push(out)

  const consoleWarn = console.warn //  preserve real fn so we can reset it
  beforeEach(() => (console.warn = mockConsoleWarn)) //  apply the mock
  afterEach(() => {
    //  reset once we're done
    mockStdout = []
    console.warn = consoleWarn
  })

  it('should emit a warning when using deprecated props', () => {
    renderBasicMock()
    expect(mockStdout).toEqual([
      'Warning: <ImageConfig /> was initialized with a deprecated prop "hideBorder". This property will be deprecated in the near future. If you\'ve provided an image caption, a border will be displayed even if "hideBorder" is set. If your image has a border built into it, please crop it to remove it.',
    ])
  })

  it('should emit a warning when instantiated with default props', () => {
    render(<ImageConfig>{testImage}</ImageConfig>)
    expect(mockStdout).toEqual([
      'Warning: <ImageConfig /> was initialized with default props. Please remove <ImageConfig /> if configuration is not needed.',
    ])
  })
})

describe('errors', () => {
  //  silence console.error, otherwise the test will fail
  const mockConsoleError = jest.spyOn(console, 'error')
  beforeAll(() => mockConsoleError.mockImplementation(() => null))
  afterAll(() => mockConsoleError.mockRestore())

  it('should error with invalid children', () => {
    expect(() => render(<ImageConfig> </ImageConfig>)).toThrowError()
    expect(() => render(<ImageConfig>{4}</ImageConfig>)).toThrowError()
    expect(() =>
      render(<ImageConfig>{'some-string'}</ImageConfig>)
    ).toThrowError()
  })

  it('should error with multiple children', () => {
    expect(() =>
      render(
        <ImageConfig>
          {testImage}
          {testImage}
        </ImageConfig>
      )
    ).toThrowError()
  })
})
