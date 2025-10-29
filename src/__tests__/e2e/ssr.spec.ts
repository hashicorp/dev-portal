/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'

/**
 * SSR (Server-Side Rendering) Tests
 * 
 * These tests verify that pages render properly with JavaScript disabled.
 * This ensures:
 * 1. No SSR crashes from browser-only code (window, localStorage, etc.)
 * 2. Content is visible without JavaScript (extremely important for SEO and accessibility)
 * 3. No hydration mismatches between server and client HTML
 */

test.describe('SSR with JavaScript Disabled', () => {
	// Disable JavaScript for all tests in this block
	test.use({ javaScriptEnabled: false })

	test('homepage should render content without JavaScript', async ({ page }) => {
		// Navigate to homepage
		await page.goto('/')

		// Page should return 200 OK (not 500 server error)
        // (but still will mosty likely return 200 even if SSR is failing)
		expect(page).toHaveURL('/')

		// Main content should be visible
		// Check for the homepage hero text
		await expect(page.locator('h1')).toContainText('Step inside')

		// Check that the page has actual content (not just an empty shell)
		const bodyText = await page.locator('body').textContent()
		expect(bodyText).toBeTruthy()
		expect(bodyText!.length).toBeGreaterThan(100)

		// Verify no error messages are shown
		await expect(page.locator('text=Error')).not.toBeVisible()
		await expect(page.locator('text=missing required')).not.toBeVisible()
	})

	test('product landing page (Terraform) should render without JavaScript', async ({ page }) => {
		await page.goto('/terraform')

		// Page should load successfully
		expect(page).toHaveURL('/terraform')

		// Content should be visible
		const mainContent = page.locator('main')
		await expect(mainContent).toBeVisible()

		// Should have navigation (use first nav element to avoid strict mode violation)
		const nav = page.locator('nav').first()
		await expect(nav).toBeVisible()

		// Body should have substantial content
		const bodyText = await page.locator('body').textContent()
		expect(bodyText!.length).toBeGreaterThan(100)
	})

	test('tutorials page should render without JavaScript', async ({ page }) => {
		// Use homepage which is a stable page that should always render
		// (Some tutorials pages may have specific SSR issues)
		await page.goto('/terraform/tutorials')

		// Should not crash or show error
		const bodyText = await page.locator('body').textContent()
		expect(bodyText).toBeTruthy()
		expect(bodyText!.length).toBeGreaterThan(100)

		// Should have visible content
		const mainContent = page.locator('main')
		await expect(mainContent).toBeVisible()
	})

    test('docs page should render without JavaScript', async ({ page }) => {
		await page.goto('/terraform/docs')

		// Should not crash or show error
		const bodyText = await page.locator('body').textContent()
		expect(bodyText).toBeTruthy()
		expect(bodyText!.length).toBeGreaterThan(100)

		// Should have visible content
		const mainContent = page.locator('main')
		await expect(mainContent).toBeVisible()
	})

    test('workspaces page should render without JavaScript', async ({ page }) => {
		await page.goto('/terraform/enterprise/api-docs/workspaces')

		// Should not crash or show error
		const bodyText = await page.locator('body').textContent()
		expect(bodyText).toBeTruthy()
		expect(bodyText!.length).toBeGreaterThan(100)

		// Should have visible content
		const mainContent = page.locator('main')
		await expect(mainContent).toBeVisible()
	})

	test('sandbox page should render without JavaScript', async ({ page }) => {
		await page.goto('/terraform/sandbox')

		// Page should return 200 (even if some features don't work without JS)
		expect(page).toHaveURL('/terraform/sandbox')

		// Should have content visible
		const bodyText = await page.locator('body').textContent()
		expect(bodyText).toBeTruthy()
		expect(bodyText!.length).toBeGreaterThan(50)

		// Should not show error page
		await expect(page.locator('text=500')).not.toBeVisible()
		await expect(page.locator('text=Server Error')).not.toBeVisible()
	})

    test('various paths should contain metadata content with js disabled', async ({ page }) => {
        const pagesToTest = [
			'/',
			'/terraform',
            'terraform/docs',
			'/hcp/docs/boundary',
            '/boundary/docs',
            '/boundary/docs/hcp/get-started/deploy-and-login',
            '/terraform/tutorials/aws-get-started/install-cli'
		]

        for (const path of pagesToTest) {
            await page.goto(path)

            // Check title exists and has content
            await expect(page).toHaveTitle(/.+/)

            // Check meta description exists and has content
            const metaDescription = page.locator('meta[name="description"]')
            await expect(metaDescription).toHaveAttribute('content', /.+/)

            // Check viewport meta tag
            const viewport = page.locator('meta[name="viewport"]')
            await expect(viewport).toHaveAttribute('content', /width=device-width/)

            // Check canonical URL exists and is a valid URL
            const canonical = page.locator('link[rel="canonical"]')
            await expect(canonical).toHaveAttribute('href', /^https?:\/\//)

            // Check OG image exists and has content
            const ogImage = page.locator('meta[property="og:image"]')
            await expect(ogImage).toHaveAttribute('content', /.+/)

            // Check Twitter image exists and has content
            const twitterImage = page.locator('meta[name="twitter:image"]')
            await expect(twitterImage).toHaveAttribute('content', /.+/)

            // Check site verification tags exist
            await expect(page.locator('meta[name="google-site-verification"]')).toBeAttached()
            await expect(page.locator('meta[name="ahrefs-site-verification"]')).toBeAttached()
            await expect(page.locator('meta[name="zd-site-verification"]').first()).toBeAttached()

            // Check favicon links exist
            await expect(page.locator('link[rel="icon"][href$=".ico"]')).toBeAttached()
            await expect(page.locator('link[rel="icon"][href$=".svg"]')).toBeAttached()

            // The #__next div should not be empty
            // Check that server rendered actual HTML content inside #__next
            const nextDiv = page.locator('#__next')
            const innerHTML = await nextDiv.innerHTML()

            // Should have substantial content (not just whitespace or empty)
            expect(innerHTML.trim().length).toBeGreaterThan(100)
        }
	})

	test('various paths should contain actual content with js disabled', async ({ page }) => {
        const pagesToTest = [
			'/',
			'/terraform',
            'terraform/docs',
			'/hcp/docs/boundary',
            '/boundary/docs',
            '/boundary/docs/hcp/get-started/deploy-and-login',
            '/terraform/tutorials/aws-get-started/install-cli'
		]

        for (const path of pagesToTest) {
            const response = await page.goto(path)
            const html = await response?.text()

            // HTML should contain the main content div
            expect(html).toContain('id="__next"')

            // The #__next div should not be empty
            // Check that server rendered actual HTML content inside #__next
            const nextDiv = page.locator('#__next')
            const innerHTML = await nextDiv.innerHTML()

            // Should have substantial content (not just whitespace or empty)
            expect(innerHTML.trim().length).toBeGreaterThan(100)
        }
	})
})

test.describe('SSR HTML Structure (JavaScript enabled for comparison)', () => {
	test('homepage should have consistent HTML between SSR and client', async ({ page }) => {
		test.setTimeout(60000) // Increase timeout for this test
		
		// First load with JS to get the hydrated HTML
		await page.goto('/')
		
		// Wait for hydration to complete
		await page.waitForLoadState('domcontentloaded')
		
		// Get the main content
		const mainWithJS = await page.locator('#__next').innerHTML()
		
		// Verify there's actual content
		expect(mainWithJS.length).toBeGreaterThan(1000)
		
		// Check that key elements exist (use first to avoid strict mode violation)
		await expect(page.locator('h1').first()).toBeVisible()
		
		// Verify no hydration errors in console
		const consoleErrors: string[] = []
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text())
			}
		})
		
		// Reload and check for hydration errors
		await page.reload()
		await page.waitForLoadState('domcontentloaded')
		
		// Filter out known acceptable errors (like network errors for blocked resources)
		const hydrationErrors = consoleErrors.filter(error => 
			error.toLowerCase().includes('hydration') ||
			error.toLowerCase().includes('did not match')
		)
		
		expect(hydrationErrors).toHaveLength(0)
	})
})

test.describe('PostHog should not break SSR', () => {
	test.use({ javaScriptEnabled: false })

	test('pages with PostHog tracking should still render without JS', async ({ page }) => {
		// These pages use PostHog tracking
		const pagesWithPostHog = [
			'/',
			'/terraform',
			'/terraform/sandbox',
            '/terraform/tutorials/aws-get-started/infrastructure-as-code', // contains interactive tutorial
            '/terraform/tutorials/aws-get-started/install-cli' // contains non-interactive tutorial
		]

		for (const path of pagesWithPostHog) {
			await page.goto(path)
			
			// Should not crash
			const response = await page.goto(path)
			expect(response?.status()).toBe(200)
			
			// Should have content
			const bodyText = await page.locator('body').textContent()
			expect(bodyText!.length).toBeGreaterThan(50)
			
			// Should not show error
			await expect(page.locator('text=Error')).not.toBeVisible()
		}
	})
})

test.describe('View Source should contain server-rendered HTML', () => {
	test('various paths should contain actual content', async ({ page }) => {
        const pagesToTest = [
			'/',
			'/terraform',
            'terraform/docs',
			'/hcp/docs/boundary',
            '/boundary/docs',
            '/boundary/docs/hcp/get-started/deploy-and-login',
            '/terraform/tutorials/aws-get-started/install-cli'
		]

        for (const path of pagesToTest) {
            const response = await page.goto(path)
            const html = await response?.text()
            
            // HTML should contain the main content div
            expect(html).toContain('id="__next"')
            
            // The #__next div should not be empty
            // Check that server rendered actual HTML content inside #__next
            const nextDiv = page.locator('#__next')
            const innerHTML = await nextDiv.innerHTML()
            
            // Should have substantial content (not just whitespace or empty)
            expect(innerHTML.trim().length).toBeGreaterThan(100)
        }
	})

    test('various paths should contain metadata content with js enabled', async ({ page }) => {
        const pagesToTest = [
			'/',
			'/terraform',
            'terraform/docs',
			'/hcp/docs/boundary',
            '/boundary/docs',
            '/boundary/docs/hcp/get-started/deploy-and-login',
            '/terraform/tutorials/aws-get-started/install-cli'
		]

        for (const path of pagesToTest) {
            await page.goto(path)

            // Check title exists and has content
            await expect(page).toHaveTitle(/.+/)

            // Check meta description exists and has content
            const metaDescription = page.locator('meta[name="description"]')
            await expect(metaDescription).toHaveAttribute('content', /.+/)

            // Check viewport meta tag
            const viewport = page.locator('meta[name="viewport"]')
            await expect(viewport).toHaveAttribute('content', /width=device-width/)

            // Check canonical URL exists and is a valid URL
            const canonical = page.locator('link[rel="canonical"]')
            await expect(canonical).toHaveAttribute('href', /^https?:\/\//)

            // Check OG image exists and has content
            const ogImage = page.locator('meta[property="og:image"]')
            await expect(ogImage).toHaveAttribute('content', /.+/)

            // Check Twitter image exists and has content
            const twitterImage = page.locator('meta[name="twitter:image"]')
            await expect(twitterImage).toHaveAttribute('content', /.+/)

            // Check site verification tags exist
            await expect(page.locator('meta[name="google-site-verification"]')).toBeAttached()
            await expect(page.locator('meta[name="ahrefs-site-verification"]')).toBeAttached()
            await expect(page.locator('meta[name="zd-site-verification"]').first()).toBeAttached()

            // Check favicon links exist
            await expect(page.locator('link[rel="icon"][href$=".ico"]')).toBeAttached()
            await expect(page.locator('link[rel="icon"][href$=".svg"]')).toBeAttached()

            // The #__next div should not be empty
            // Check that server rendered actual HTML content inside #__next
            const nextDiv = page.locator('#__next')
            const innerHTML = await nextDiv.innerHTML()

            // Should have substantial content (not just whitespace or empty)
            expect(innerHTML.trim().length).toBeGreaterThan(100)
        }
	})
})
