/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen } from '@testing-library/react'
import { useCurrentProduct } from 'contexts'
import { ReleaseVersion } from 'lib/fetch-release-data'
import ReleaseInformationSection from './index'

vi.mock('contexts', () => ({
	useCurrentProduct: vi.fn(),
}))

const releaseHeading = { id: 'release-information', text: 'Release information' }

const makeRelease = (name: string, version: string) =>
	({
		name,
		version,
		shasums: `${name}_${version}_SHA256SUMS`,
		shasums_signature: `${name}_${version}_SHA256SUMS.sig`,
		builds: [],
	}) as unknown as ReleaseVersion

describe('ReleaseInformationSection changelog card', () => {
	describe('for Boundary', () => {
		beforeEach(() => {
			vi.mocked(useCurrentProduct).mockReturnValue({
				slug: 'boundary',
				name: 'Boundary',
			} as ReturnType<typeof useCurrentProduct>)
		})

		it.each([true, false])(
			'links to the docs release notes when isEnterpriseMode is %s',
			(isEnterpriseMode) => {
				render(
					<ReleaseInformationSection
						isEnterpriseMode={isEnterpriseMode}
						releaseHeading={releaseHeading}
						selectedRelease={makeRelease('boundary', '1.1.1+ent')}
					/>
				)

				expect(screen.getByText('Release notes')).toBeInTheDocument()
				expect(screen.queryByText('Changelog')).not.toBeInTheDocument()

				const link = screen.getByRole('link', {
					name: 'boundary version 1.1.1+ent release notes',
				})
				expect(link).toHaveAttribute(
					'href',
					'/boundary/docs/updates/release-notes'
				)
				expect(link).not.toHaveAttribute('target', '_blank')
			}
		)

		it('keeps showing the selected version in the subheading', () => {
			render(
				<ReleaseInformationSection
					isEnterpriseMode
					releaseHeading={releaseHeading}
					selectedRelease={makeRelease('boundary', '1.1.1+ent')}
				/>
			)

			expect(
				screen.getByText('Boundary Version: 1.1.1+ent')
			).toBeInTheDocument()
		})
	})

	describe('for other products', () => {
		beforeEach(() => {
			vi.mocked(useCurrentProduct).mockReturnValue({
				slug: 'vault',
				name: 'Vault',
			} as ReturnType<typeof useCurrentProduct>)
		})

		it('still links to the GitHub release changelog', () => {
			render(
				<ReleaseInformationSection
					isEnterpriseMode={false}
					releaseHeading={releaseHeading}
					selectedRelease={makeRelease('vault', '1.15.0')}
				/>
			)

			expect(screen.getByText('Changelog')).toBeInTheDocument()
			expect(screen.queryByText('Release notes')).not.toBeInTheDocument()

			const link = screen.getByRole('link', {
				name: 'vault version 1.15.0 changelog',
			})
			expect(link).toHaveAttribute(
				'href',
				'https://github.com/hashicorp/vault/releases/tag/v1.15.0'
			)
		})
	})
})
