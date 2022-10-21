/**
 * These specs are temporary to ensure that our beta opt-in/out flows are functioning as expected
 *
 * They will become unnecessary post our GA launch during HashiConf Global
 */
import { test, expect } from '@playwright/test'

test('should opt-in based on optInFrom query parameter', async ({
	page,
	context,
	baseURL,
}) => {
	await page.goto('/waypoint/docs?optInFrom=waypoint-io')
	const betaOptInCookie = (await context.cookies(baseURL)).find(
		(cookie) => cookie.name === 'waypoint-io-beta-opt-in'
	)
	expect(betaOptInCookie).not.toBeUndefined()
})

test('should opt-out based on betaOptOut query parameter', async ({
	page,
	context,
	baseURL,
}) => {
	await context.addCookies([
		{
			name: 'hc_dd_proxied_site',
			value: 'www.waypointproject.io',
			url: baseURL,
		},
	])
	await context.addCookies([
		{
			name: 'waypoint-io-beta-opt-in',
			value: 'true',
			url: baseURL,
		},
	])
	const response = await page.goto('/?betaOptOut=true')
	const betaOptInCookie = (await context.cookies(baseURL)).find(
		(cookie) => cookie.name === 'waypoint-io-beta-opt-in'
	)
	expect(betaOptInCookie).toBeUndefined()
	expect(response.url()).not.toContain('?betaOptOut=true')
})
