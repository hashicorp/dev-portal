/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import nock from 'nock'

import * as contentApi from '.'

import document200 from './__fixtures__/document_200.json'
import document404 from './__fixtures__/document_404.json'
import navData200 from './__fixtures__/navData_200.json'
import navData404 from './__fixtures__/navData_404.json'
import versionMetadata200 from './__fixtures__/versionMetadata_200.json'
import versionMetadataEmpty from './__fixtures__/versionMetadata_empty.json'

describe('contentApi', () => {
	let scope: nock.Scope

	beforeEach(() => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		scope = nock(process.env.MKTG_CONTENT_DOCS_API!)
	})

	describe('fetchDocument', () => {
		it('should return the requested document', async () => {
			scope
				.get('/api/content/waypoint/doc/v0.5.x/commands/k8s-bootstrap')
				.reply(200, document200)

			const res = await contentApi.fetchDocument(
				'waypoint',
				'doc/v0.5.x/commands/k8s-bootstrap'
			)
			expect(res).toMatchSnapshot()
		})

		it('should throw if a document is not found', async () => {
			scope
				.get('/api/content/waypoint/doc/latest/commands/k8s-bootstrap')
				.reply(404, document404)

			await expect(async () => {
				await contentApi.fetchDocument(
					'waypoint',
					'doc/latest/commands/k8s-bootstrap'
				)
			}).rejects.toThrowErrorMatchingSnapshot()
		})
	})

	describe('fetchNavData', () => {
		it('should return the requested navdata', async () => {
			scope
				.get('/api/content/waypoint/nav-data/v0.5.x/commands')
				.reply(200, navData200)

			const res = await contentApi.fetchNavData(
				'waypoint',
				'commands',
				'v0.5.x'
			)
			expect(res).toMatchSnapshot()
		})

		it('should throw if a navData is not found', async () => {
			scope
				.get('/api/content/waypoint/nav-data/v0.9000.x/commands')
				.reply(404, navData404)

			await expect(async () => {
				await contentApi.fetchNavData('waypoint', 'commands', 'v0.9000.x')
			}).rejects.toThrowErrorMatchingSnapshot()
		})
	})

	describe('fetchVersionMetadataList', () => {
		it('should return the requested version metadata list', async () => {
			scope
				.get('/api/content/waypoint/version-metadata')
				.query({ partial: true })
				.reply(200, versionMetadata200)

			const res = await contentApi.fetchVersionMetadataList('waypoint')
			expect(res).toMatchSnapshot()
		})

		it('should return an empty list for invalid product name', async () => {
			scope
				.get('/api/content/waypointzzz/version-metadata')
				.query({ partial: true })
				.reply(200, versionMetadataEmpty)

			const res = await contentApi.fetchVersionMetadataList('waypointzzz')
			expect(res).toMatchSnapshot()
		})
	})
})
