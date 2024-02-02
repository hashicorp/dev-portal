/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactNode } from 'react'
import { VersionSelectItem } from 'views/docs-view/loaders/remote-content'
import { render } from '@testing-library/react'
import { CurrentProductProvider } from 'contexts'
import DocsVersionSwitcher from '.'
import { setProjectForAriaLabel } from '.'

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
				isLatest: false,
				label: 'v0.10.x (alpha)',
				version: 'v0.10.x',
				name: 'v0.10.x',
				releaseStage: 'alpha',
			},
			{
				isLatest: true,
				label: 'v0.9.x (latest)',
				version: 'v0.9.x',
				name: 'latest',
				releaseStage: 'stable',
			},
			{
				isLatest: false,
				label: 'v0.8.x',
				version: 'v0.8.x',
				name: 'v0.8.x',
				releaseStage: 'stable',
			},
			{
				isLatest: false,
				label: 'v0.7.x',
				version: 'v0.7.x',
				name: 'v0.7.x',
				releaseStage: 'stable',
			},
		]

		wrapper = function Wrapper({ children }: { children: ReactNode }) {
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

		// assert that only n-1 versions are shown in the dropdown
		const links = queryAllByRole('link')
		expect(links).toHaveLength(3)

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
		expect(links).toHaveLength(3)

		// link to latest
		expect(links[1]).not.toHaveAttribute('rel')

		// link to an older version
		expect(links[2]).toHaveAttribute('rel', 'nofollow')
	})
})

const cases = [
	{
		projectName: null,
		currentRootDocsPath: {
			iconName: 'file-source',
			name: 'Configuration Language',
			path: 'language',
		},
		currentProduct: {
			slug: 'terraform',
			name: 'Terraform',
		},
	},
	{
		projectName: null,
		currentRootDocsPath: {
			iconName: 'terminal-screen',
			name: 'Terraform CLI',
			path: 'cli',
		},
		currentProduct: {
			slug: 'terraform',
			name: 'Terraform',
		},
	},
	{
		projectName: 'Terraform Enterprise',
		currentRootDocsPath: {
			iconName: 'org',
			name: 'Terraform Enterprise',
			path: 'enterprise',
			productSlugForLoader: 'ptfe-releases',
		},
		currentProduct: {
			slug: 'terraform',
			name: 'Terraform',
		},
	},
	{
		projectName: null,
		currentRootDocsPath: {
			iconName: 'docs',
			name: 'Intro',
			path: 'intro',
		},
		currentProduct: {
			slug: 'terraform',
			name: 'Terraform',
		},
	},
]

describe('setProjectForAriaLabel', () => {
	it('Terraform - Configuration Language', () => {
		const result = setProjectForAriaLabel(
			cases[0].projectName,
			cases[0].currentRootDocsPath,
			cases[0].currentProduct
		)

		expect(result).toBe(`Terraform Configuration Language`)
	})
	it('Terraform - Terraform CLI', () => {
		const result = setProjectForAriaLabel(
			cases[1].projectName,
			cases[1].currentRootDocsPath,
			cases[1].currentProduct
		)

		expect(result).toBe(`Terraform CLI`)
	})
	it('Terraform - Terraform Enterprise', () => {
		const result = setProjectForAriaLabel(
			cases[2].projectName,
			cases[2].currentRootDocsPath,
			cases[2].currentProduct
		)

		expect(result).toBe(`Terraform Enterprise`)
	})

	it('Terraform - Intro', () => {
		const result = setProjectForAriaLabel(
			cases[3].projectName,
			cases[3].currentRootDocsPath,
			cases[3].currentProduct
		)

		expect(result).toBe(`Terraform Intro`)
	})
})
