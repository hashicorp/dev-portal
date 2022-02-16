import { render, screen } from '@testing-library/react'
import axe from 'axe-core'
import Tabs, { Tab } from '.'

describe('<Tabs />', () => {
  test('renders the correct markup with required props', (done) => {
    const testData = [
      { heading: 'Tab 1', content: 'content in tab 1' },
      { heading: 'Tab 2', content: 'content in tab 2' },
    ]
    const { container } = render(
      <Tabs>
        {testData.map(({ heading, content }, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tab heading={heading} key={index}>
            {content}
          </Tab>
        ))}
      </Tabs>
    )

    // Check the tab buttons container
    const tablist = screen.queryByRole('tablist')
    expect(tablist).toBeInTheDocument()
    expect(tablist).not.toHaveAccessibleName()

    testData.forEach(({ heading, content }, index) => {
      // Check each tab button
      const tabButton = screen.queryByRole('tab', {
        name: heading,
        selected: index === 0,
      })
      expect(tabButton).toBeInTheDocument()
      expect(tabButton).toHaveAccessibleName()
      expect(tabButton.getAttribute('tabindex')).toBe(index === 0 ? '0' : '-1')

      // Check each tab panel
      const tabPanel = screen.queryByRole('tabpanel', {
        name: heading,
        hidden: index > 0,
      })
      if (index === 0) {
        expect(tabPanel).toBeInTheDocument()
        expect(tabPanel).toHaveAccessibleName()
        expect(tabPanel.getAttribute('tabindex')).toBe('0')
        expect(tabPanel.textContent).toBe(content)
      } else {
        expect(tabPanel).not.toBeInTheDocument()
      }
    })

    // Check for violations identified by axe-core
    axe.run(container, {}, (err, { violations }) => {
      expect(err).toBeNull()
      expect(violations).toHaveLength(0)
      done()
    })
  })
})
