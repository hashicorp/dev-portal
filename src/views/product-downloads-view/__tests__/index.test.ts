/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { ReleasesAPIResponse } from '@hashicorp/react-product-downloads-page'
import { setTableOfContents } from '../helpers'
import releases from './__fixtures__/releases.json'
import { FeaturedCollectionCard } from '../types'

describe('setTableOfContents helper function', () => {
	const boundaryTableOfContents = [
		{ divider: 'true' },
		{ heading: 'Operating Systems' },
		{ fullPath: '#macOS', title: 'macOS' },
		{ fullPath: '#Windows', title: 'Windows' },
		{ fullPath: '#Linux', title: 'Linux' },
		{ fullPath: '#FreeBSD', title: 'FreeBSD' },
		{ fullPath: '#OpenBSD', title: 'OpenBSD' },
		{ fullPath: '#Solaris', title: 'Solaris' },
		{ fullPath: '#Desktop-client', title: 'Desktop client' },
		{ divider: 'true' },
		{ fullPath: '#Release-information', title: 'Release information' },
	]
	const completeTableOfContents = [
		{ divider: 'true' },
		{ heading: 'Operating Systems' },
		{ fullPath: '#macOS', title: 'macOS' },
		{ fullPath: '#Windows', title: 'Windows' },
		{ fullPath: '#Linux', title: 'Linux' },
		{ fullPath: '#FreeBSD', title: 'FreeBSD' },
		{ fullPath: '#OpenBSD', title: 'OpenBSD' },
		{ fullPath: '#Solaris', title: 'Solaris' },
		{ divider: 'true' },
		{ fullPath: '#Release-information', title: 'Release information' },
		{ fullPath: '#Next-steps', title: 'Next steps' },
	]
	const tocWithoutNextSteps = [
		{ divider: 'true' },
		{ heading: 'Operating Systems' },
		{ fullPath: '#macOS', title: 'macOS' },
		{ fullPath: '#Windows', title: 'Windows' },
		{ fullPath: '#Linux', title: 'Linux' },
		{ fullPath: '#FreeBSD', title: 'FreeBSD' },
		{ fullPath: '#OpenBSD', title: 'OpenBSD' },
		{ fullPath: '#Solaris', title: 'Solaris' },
		{ divider: 'true' },
		{ fullPath: '#Release-information', title: 'Release information' },
	]
	it('returns an empty array if releases arg is not passed', () => {
		const tableOfContents = setTableOfContents(
			undefined,
			'1.6.5',
			[],
			[],
			'boundary'
		)
		expect(tableOfContents).toMatchObject([])
	})

	it('returns a Desktop client anchor heading if the current slug is boundary', () => {
		const tableOfContents = setTableOfContents(
			releases as ReleasesAPIResponse,
			'1.6.5',
			[],
			[],
			'boundary'
		)
		expect(tableOfContents).toEqual(boundaryTableOfContents)
	})

	it('returns Next steps heading if featured collections or featured tutorials is not an empty array', () => {
		const mockedFeaturedCollectionCards: FeaturedCollectionCard[] = [
			{
				id: '1',
				dbSlug: 'terraform',
				description: 'description',
				heading: 'heading',
				productsUsed: [],
				tutorialCount: 1,
				url: 'url',
			},
		]

		const tableOfContents = setTableOfContents(
			releases as ReleasesAPIResponse,
			'1.6.5',
			mockedFeaturedCollectionCards,
			[],
			'terraform'
		)

		expect(tableOfContents).toMatchObject(completeTableOfContents)
	})

	it('returns an object without the next steps heading when featuredCollectionCards and featuredTutorialsCards are empty arrays', () => {
		const tableOfContents = setTableOfContents(
			releases as ReleasesAPIResponse,
			'1.6.5',
			[],
			[],
			'terraform'
		)

		expect(tableOfContents).toMatchObject(tocWithoutNextSteps)
	})

	it('returns an object without the next steps heading when featuredCollectionCards and featuredTutorialsCards are undefined', () => {
		const tableOfContents = setTableOfContents(
			releases as ReleasesAPIResponse,
			'1.6.5',
			undefined,
			undefined,
			'terraform'
		)

		expect(tableOfContents).toMatchObject(tocWithoutNextSteps)
	})
})
