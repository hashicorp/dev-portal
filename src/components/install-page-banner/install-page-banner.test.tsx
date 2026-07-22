/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import { InstallPageBanner } from './index'

describe('InstallPageBanner', () => {
	describe('with no link', () => {
		it('renders the description text and no anchor', () => {
			const { getByText, queryByRole } = render(
				<InstallPageBanner description="Download the Vault binary from the releases page." />
			)
			expect(
				getByText('Download the Vault binary from the releases page.')
			).toBeInTheDocument()
			expect(queryByRole('link')).not.toBeInTheDocument()
		})
	})

	describe('with a link whose text appears in the description', () => {
		it('splices the link inline at the correct position', () => {
			const { getByRole } = render(
				<InstallPageBanner
					description="Read the migration guide before upgrading."
					link={{ text: 'migration guide', href: '/vault/docs/upgrading' }}
				/>
			)
			const link = getByRole('link', { name: 'migration guide' })
			expect(link).toHaveAttribute('href', '/vault/docs/upgrading')
			// The surrounding prose should still be intact around the link
			expect(link.parentElement).toHaveTextContent(
				'Read the migration guide before upgrading.'
			)
		})
	})

	describe('with a link whose text does not appear in the description', () => {
		it('appends the link after the description as a fallback', () => {
			const { getByRole } = render(
				<InstallPageBanner
					description="Please read the docs for more information."
					link={{ text: 'migration guide', href: '/vault/docs/upgrading' }}
				/>
			)
			const link = getByRole('link', { name: 'migration guide' })
			expect(link).toHaveAttribute('href', '/vault/docs/upgrading')
			// Description text comes first, then the appended link text
			expect(link.parentElement).toHaveTextContent(
				'Please read the docs for more information. migration guide'
			)
		})
	})
})
