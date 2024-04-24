/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getHvdCategoryGroupsPaths } from '../server'
import { HvdCategoryGroup } from '../types'

// mock the extract-hvd-content file because importing from it cause it's self-invoking function to perform a side effect
vi.mock('@scripts/extract-hvd-content', () => ({
	__esModule: true, // this property makes it work
	HVD_CONTENT_DIR: '',
}))

const mockedHvdCategoryGroups: HvdCategoryGroup[] = [
	{
		slug: 'terraform-operation-guides',
		title: 'terraform operation guides',
		description: 'description',
		productSlug: 'terraform',
		guides: [
			{
				slug: 'terraform-operation-guides-adoption',
				title: 'terraform operation guide adoption',
				description: 'description',
				href: '/validated-designs/terraform-operation-guides-adoption',
				pages: [
					{
						slug: 'introduction',
						title: 'introduction',
						href: '/validated-designs/terraform-operation-guides-adoption/introduction',
						filePath:
							'/content/terraform/operation-guides/adoption/0000-introduction.mdx',
					},
					{
						slug: 'people-and-process',
						title: 'people and process',
						href: '/validated-designs/terraform-operation-guides-adoption/people-and-process',
						filePath:
							'/content/terraform/operation-guides/adoption/0010-people-and-process.mdx',
					},
				],
			},
		],
	},
	{
		slug: 'terraform-integration-guides',
		title: 'terraform integration guides',
		description: 'description',
		productSlug: 'terraform',
		guides: [
			{
				slug: 'terraform-integration-guides-run-task-prisma-cloud-by-palo-alto',
				title: 'terraform integration guide run task prisma cloud by palo alto',
				description: 'description',
				href: '/validated-designs/terraform-integration-guides-run-task-prisma-cloud-by-palo-alto',
				pages: [
					{
						slug: 'introduction',
						title: 'introduction',
						href: '/validated-designs/terraform-integration-guides-run-task-prisma-cloud-by-palo-alto/introduction',
						filePath:
							'/content/terraform/operation-guides/run-task-prisma-cloud-by-palo-alto/0000-introduction.mdx',
					},
				],
			},
		],
	},
]

describe('server', function () {
	it('test dev-portal.getHvdCategoryGroupsPaths', function () {
		const paths = getHvdCategoryGroupsPaths(mockedHvdCategoryGroups)

		expect(paths).toEqual([
			['terraform-operation-guides-adoption'],
			['terraform-operation-guides-adoption', 'introduction'],
			['terraform-operation-guides-adoption', 'people-and-process'],
			['terraform-integration-guides-run-task-prisma-cloud-by-palo-alto'],
			[
				'terraform-integration-guides-run-task-prisma-cloud-by-palo-alto',
				'introduction',
			],
		])
	})
})
