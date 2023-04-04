/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { render } from '@testing-library/react'
import { CurrentProductProvider } from 'contexts'
import DocsVersionSwitcher from '.'

const mockUserRouter = jest.fn()
jest.mock('next/router', () => ({
	useRouter: () => mockUserRouter(),
}))

describe('DocsVersionSwitcher', () => {
	let options: VersionSelectItem[]
	let wrapper: React.FC

	beforeEach(() => {
		options = [
			{
				isLatest: true,
				label: 'v0.9.x (latest)',
				version: 'v0.9.x',
				name: 'latest',
			},
			{ isLatest: false, label: 'v0.8.x', version: 'v0.8.x', name: 'v0.8.x' },
			{ isLatest: false, label: 'v0.7.x', version: 'v0.7.x', name: 'v0.7.x' },
		]

		wrapper = function Wrapper({ children }) {
			return (
				<CurrentProductProvider
					currentProduct={
						{
							name: 'Waypoint',
							slug: 'waypoint',
							currentRootDocsPath: {
								iconName: 'docs',
								name: 'General Documentation',
								path: 'docs',
								shortName: 'Documentation',
								includeMDXSource: true,
							},
						} as $TSFixMe
					}
				>
					{children}
				</CurrentProductProvider>
			)
		}
	})

	afterEach(() => {
		mockUserRouter.mockReset()
	})

	it.each([
		['/waypoint/docs', 'v0.9.x (latest)'],
		['/waypoint/docs/v0.8.x', 'v0.8.x'],
	])('given path "%s", hides "%s" from the dropdown', (asPath, exclude) => {
		mockUserRouter.mockImplementation(() => ({
			asPath: asPath,
		}))

		const { queryAllByRole, queryByRole } = render(
			<DocsVersionSwitcher options={options} />,
			{ wrapper }
		)

		// assert that only 2 of the 3 versions are shown in the dropdown
		const links = queryAllByRole('link')
		expect(links).toHaveLength(2)

		// assert that the currently selected version is not shown in the dropdown
		const dropdown = queryByRole('list')
		expect(dropdown).not.toHaveTextContent(exclude)
	})

	it("passes `rel='nofollow'` to versioned links", () => {
		mockUserRouter.mockImplementation(() => ({
			asPath: '/waypoint/docs/v0.8.x',
		}))

		const { queryAllByRole } = render(
			<DocsVersionSwitcher options={options} />,
			{ wrapper }
		)

		const links = queryAllByRole('link')
		expect(links).toHaveLength(2)

		// link to latest
		expect(links[0]).not.toHaveAttribute('rel')

		// link to v0.7.x
		expect(links[1]).toHaveAttribute('rel', 'nofollow')
	})

	it('selects the latest version by default when a prerelease version is present', () => {
		mockUserRouter.mockImplementation(() => ({
			asPath: '/nomad/docs',
		}))
		const options = [
			{
				isLatest: false,
				label: 'v1.6.0 (next)',
				version: 'v1.6.x',
				name: 'v1.6.x',
			},
			{
				isLatest: true,
				label: 'v1.5.x (latest)',
				version: 'v1.5.x',
				name: 'latest',
			},
			{ isLatest: false, label: 'v1.4.x', version: 'v1.4.x', name: 'v1.4.x' },
			{ isLatest: false, label: 'v1.3.x', version: 'v1.3.x', name: 'v1.3.x' },
		]

		const { queryByRole } = render(<DocsVersionSwitcher options={options} />, {
			wrapper,
		})

		const dropdownButton = queryByRole('button')
		expect(dropdownButton).toHaveTextContent('v1.5.x (latest)')

		const list = queryByRole('list')
		expect(list.textContent).toMatchInlineSnapshot(
			`"Waypointv1.6.0 (next)v1.4.xv1.3.x"`
		)
	})
})
