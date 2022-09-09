import { render } from '@testing-library/react'
import { CurrentProductProvider } from 'contexts'
import DocsVersionSwitcher from '.'

jest.mock('next/router', () => ({
	useRouter: () => ({
		asPath: '/waypoint/docs',
	}),
}))

describe('DocsVersionSwitcher', () => {
	it("passes `rel='nofollow'` to versioned links", () => {
		const { queryAllByRole } = render(
			<DocsVersionSwitcher
				// prettier-ignore
				options={[
					{ isLatest: true, label: 'v0.9.x (latest)', version: 'v0.9.x', name: "latest" },
					{ isLatest: false, label: 'v0.8.x', version: 'v0.8.x', name: "v0.8.x" },
					{ isLatest: false, label: 'v0.7.x', version: 'v0.7.x', name: "v0.7.x" },
				]}
			/>,
			{
				wrapper: ({ children }) => (
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
				),
			}
		)

		const links = queryAllByRole('link')
		expect(links).toHaveLength(3)
		expect(links[0]).not.toHaveAttribute('rel')
		expect(links[1]).toHaveAttribute('rel', 'nofollow')
		expect(links[2]).toHaveAttribute('rel', 'nofollow')
	})
})
