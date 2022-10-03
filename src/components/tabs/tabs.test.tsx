import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import TabProvider from './provider'
import Tabs, { Tab } from '.'

describe('<Tabs />', () => {
	const testData = [
		{ heading: 'Tab 1', content: 'content in tab 1' },
		{ heading: 'Tab 2', content: 'content in tab 2' },
		{ heading: 'Tab 3', content: 'content in tab 3' },
	]

	describe('with only required props', () => {
		let container: HTMLElement

		beforeEach(() => {
			const results = render(
				<TabProvider>
					<Tabs>
						{testData.map(({ heading, content }, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<Tab heading={heading} key={index}>
								{content}
							</Tab>
						))}
					</Tabs>
				</TabProvider>
			)
			container = results.container
		})

		describe('without interaction', () => {
			test('has no violations identified by axe-core', (done) => {
				axe.run(container, {}, (err, { violations }) => {
					expect(err).toBeNull()
					expect(violations).toHaveLength(0)
					done()
				})
			})

			test('has a role="tablist" with the correct properties', () => {
				const tablist = screen.queryByRole('tablist')
				expect(tablist).toBeInTheDocument()
				expect(tablist).not.toHaveAccessibleName()
			})

			test('has the correct number of role="tab" and role="tabpanel" elements with the correct properties', () => {
				testData.forEach(({ heading, content }, index) => {
					/**
					 * This query tests the:
					 *  - `heading` prop by find a tab button based on the text in the prop
					 *  - `aria-selected` prop by checking the index of the tab/panel pair
					 *    getting rendered
					 */
					const tabButton = screen.queryByRole('tab', {
						name: heading,
						selected: index === 0,
					})

					/**
					 * This query tests the:
					 *  - `aria-labelledby` prop on tab panels by checking for a `name` that
					 *    is equal to the associated tab button's text
					 *  - `aria-hidden` prop by checking the index of the tab/panel pair
					 *    getting rendered
					 */
					const tabPanel = screen.queryByRole('tabpanel', {
						name: heading,
						hidden: index > 0,
					})

					/**
					 * Tab button assertions
					 *
					 * TODO: not sure how to test `aria-controls` or `id` attributes better
					 * yet since only the active (first, in this case) tab panel is in the
					 * document.
					 */
					expect(tabButton).toBeInTheDocument()
					expect(tabButton).toHaveAccessibleName()
					expect(tabButton.getAttribute('aria-controls')).toBeDefined()
					expect(tabButton.getAttribute('id')).toBeDefined()
					expect(tabButton.getAttribute('tabindex')).toBe(
						index === 0 ? '0' : '-1'
					)

					/**
					 * Tab panel assertions
					 *
					 * Only the active tab panel will be in the document because of the CSS
					 * we apply that hides non-active panels.
					 */
					if (index === 0) {
						expect(tabPanel).toBeInTheDocument()
						expect(tabPanel).toHaveAccessibleName()
						expect(tabPanel.textContent).toBe(content)
					} else {
						expect(tabPanel).not.toBeInTheDocument()
					}
				})
			})
		})

		describe('with interaction', () => {
			test('mouse click changes the active tab', async () => {
				/**
				 * Queries for the second tab button by text and asserts checks that it is
				 * not already selected, which it should not be since the first tab is
				 * active by default.
				 */
				const secondTabButton = screen.queryByRole('tab', {
					name: testData[1].heading,
					selected: false,
				})

				await userEvent.click(secondTabButton)

				/**
				 * Checks that the first tab panel is no longer active and visible in the
				 * document.
				 */
				const firstTabPanel = screen.queryByRole('tabpanel', {
					name: testData[0].heading,
				})
				expect(firstTabPanel).not.toBeInTheDocument()

				/**
				 * Checks that the second tab panel is active, in the document, and that it
				 * has the correct content.
				 */
				const secondTabPanel = screen.queryByRole('tabpanel', {
					name: testData[1].heading,
				})
				expect(secondTabPanel).toBeInTheDocument()
				expect(secondTabPanel.textContent).toBe(testData[1].content)
			})

			/**
			 * NOTE: using `fireEvent.keyDown` instead of `userEvent.keyboard` here to
			 * specifically test the `keyDown` handler.
			 */
			test('`onKeyDown` does not change the active tab', () => {
				const keysToTest = ['Enter', ' ', 'ArrowRight', 'ArrowLeft']
				keysToTest.forEach((key) => {
					const secondTabButton = screen.queryByRole('tab', {
						name: testData[1].heading,
					})
					fireEvent.keyDown(secondTabButton, { key })

					const firstTabPanel = screen.queryByRole('tabpanel', {
						name: testData[0].heading,
					})
					expect(firstTabPanel).toBeInTheDocument()
				})
			})

			describe('`onKeyUp`', () => {
				test('Enter and Space keys do nothing', () => {
					const keysToTest = ['Enter', ' ']
					keysToTest.forEach((key) => {
						const secondTabButton = screen.queryByRole('tab', {
							name: testData[1].heading,
						})
						fireEvent.keyUp(secondTabButton, { key })

						const firstTabPanel = screen.queryByRole('tabpanel', {
							name: testData[0].heading,
						})
						expect(firstTabPanel).toBeInTheDocument()
					})
				})

				test('ArrowRight and ArrowLeft keys set the next and previous tab active, respectively', async () => {
					/**
					 * Activate the second tab from the first one with ArrowRight.
					 */
					const firstTabButton = screen.queryByRole('tab', {
						name: testData[0].heading,
					})
					fireEvent.keyUp(firstTabButton, { key: 'ArrowRight' })

					// Wait for the second tab panel to no longer be hidden
					await screen.findByRole('tabpanel', {
						name: testData[1].heading,
						hidden: false,
					})

					/**
					 * Activate the first tab from the second one with ArrowLeft.
					 */
					const secondTabButton = screen.queryByRole('tab', {
						name: testData[1].heading,
					})
					fireEvent.keyUp(secondTabButton, { key: 'ArrowLeft' })

					// Wait for the first tab panel to no longer be hidden
					await screen.findByRole('tabpanel', {
						name: testData[0].heading,
						hidden: false,
					})
				})

				test('focus wraps correctly to and from the first and last tab buttons with arrow keys', async () => {
					/**
					 * Focus wraps from the first to the last tab button with ArrowLeft.
					 */
					const firstTabButton = screen.queryByRole('tab', {
						name: testData[0].heading,
					})
					fireEvent.keyUp(firstTabButton, { key: 'ArrowLeft' })

					// Wait for the last tab panel to no longer be hidden
					await screen.findByRole('tabpanel', {
						name: testData[testData.length - 1].heading,
						hidden: false,
					})

					/**
					 * Focus wraps from the last to the first tab button with ArrowRight.
					 */
					const lastTabButton = screen.queryByRole('tab', {
						name: testData[testData.length - 1].heading,
					})
					fireEvent.keyUp(lastTabButton, { key: 'ArrowRight' })

					// Wait for the first tab panel to no longer be hidden
					await screen.findByRole('tabpanel', {
						name: testData[0].heading,
						hidden: false,
					})
				})
			})
		})
	})

	test('the `initialActiveIndex` correctly activates a tab index on inital render', () => {
		const testInitialActiveIndex = 1
		render(
			<TabProvider>
				<Tabs initialActiveIndex={testInitialActiveIndex}>
					{testData.map(({ heading, content }, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<Tab heading={heading} key={index}>
							{content}
						</Tab>
					))}
				</Tabs>
			</TabProvider>
		)

		expect(
			screen.queryByRole('tab', {
				name: testData[testInitialActiveIndex].heading,
				selected: true,
			})
		).toBeInTheDocument()
		expect(
			screen.queryByRole('tabpanel', {
				name: testData[testInitialActiveIndex].heading,
				hidden: false,
			})
		).toBeInTheDocument()
	})

	test('the `ariaLabel` prop correctly gives the component an accessible label', () => {
		const testAriaLabel = 'A set of tabs'
		render(
			<TabProvider>
				<Tabs ariaLabel={testAriaLabel}>
					{testData.map(({ heading, content }, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<Tab heading={heading} key={index}>
							{content}
						</Tab>
					))}
				</Tabs>
			</TabProvider>
		)

		const rootContainer = screen.queryByLabelText(testAriaLabel)
		expect(rootContainer).toBeInTheDocument()
		expect(rootContainer).toHaveAccessibleName()
	})

	test('the `ariaLabelledBy` prop correctly gives the component an accessible label', () => {
		const testAriaLabelledById = 'a-special-tabs-label'
		const testAriaLabelledByText = 'A set of tabs'
		render(
			<TabProvider>
				<p id={testAriaLabelledById}>{testAriaLabelledByText}</p>
				<Tabs ariaLabelledBy={testAriaLabelledById}>
					{testData.map(({ heading, content }, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<Tab heading={heading} key={index}>
							{content}
						</Tab>
					))}
				</Tabs>
			</TabProvider>
		)

		const rootContainer = screen.queryByLabelText(testAriaLabelledByText)
		expect(rootContainer).toBeInTheDocument()
		expect(rootContainer).toHaveAccessibleName()
	})

	test('the `showAnchorLine` test adds an extra classname to role="tablist"', () => {
		render(
			<TabProvider>
				<Tabs>
					{testData.map(({ heading, content }, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<Tab heading={heading} key={index}>
							{content}
						</Tab>
					))}
				</Tabs>
			</TabProvider>
		)

		const targetElement = screen.queryByRole('tablist').parentElement
		expect(targetElement).toHaveClass('showAnchorLine')
	})
})
