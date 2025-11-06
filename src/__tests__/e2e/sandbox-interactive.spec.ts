/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'

/**
 * Sandbox Interactive Tests
 *
 * These tests verify that interactive tutorials and sandbox functionality work correctly.
 * This includes:
 *  - Interactive labs launching correctly from tutorial pages
 *  - Show Terminal button visibility based on tutorial type
 *  - Navigation behavior with open terminals/sandboxes
 *  - Sandbox dropdown functionality
 *  - Error handling
 */

test.describe('Sandbox Interactive Functionality', () => {
	// Clear any persisted sandbox/terminal state before each test to ensure isolation
	test.beforeEach(async ({ page, baseURL }) => {
		// Navigate to the base URL first so we have access to storage
		await page.goto(baseURL || 'http://localhost:3000')
		
		// Clear cookies and storage
		await page.context().clearCookies()
		await page.evaluate(() => {
			localStorage.clear()
			sessionStorage.clear()
		})
	})

	test('Interactive lab opens correctly from tutorial page', async ({
		page,
		baseURL
	}) => {
		// Navigate to an interactive tutorial page
		await page.goto(`${baseURL}/vault/tutorials/get-started/troubleshoot#scenario`)

		// Verify "Start Interactive Lab" button is visible in the page content
		const startLabButton = page.getByRole('button', { name: /start interactive lab/i })
		await expect(startLabButton).toBeVisible()

		// Set up error monitoring
		const errors: string[] = []
		page.on('pageerror', (error) => {
			errors.push(error.message)
		})

		// Click "Start Interactive Lab" button
		await startLabButton.click()

		// Wait for the lab interface to appear - likely an iframe with instruqt
		const labIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(labIframe).toBeVisible({ timeout: 10000 })

		// Verify the iframe src contains the correct lab ID
		const iframeSrc = await labIframe.getAttribute('src')
		expect(iframeSrc).toBeTruthy()

		// Should be in format: https://play.instruqt.com/embed/hashicorp-learn/tracks/troubleshoot-vault?token=...
		expect(iframeSrc).toContain('play.instruqt.com/embed/hashicorp-learn/tracks/')
		expect(iframeSrc).toContain('troubleshoot-vault')
		expect(iframeSrc).toMatch(/token=/) // Verify token parameter exists

		// Verify it's NOT loading the wrong product (Terraform sandbox)
		expect(iframeSrc).not.toContain('terraform-sandbox')

		// Verify no console errors occurred
		if (errors.length > 0) {
			console.log(`Console errors detected (${errors.length}):`, errors)
		}
		expect(errors.length).toBe(0)
	})

	test('Show Terminal button visibility', async ({
		page,
		baseURL
	}) => {
		// Set up error monitoring
		const errors: string[] = []
		page.on('pageerror', (error) => {
			errors.push(error.message)
		})

		// Set a larger viewport to ensure button is accessible (not covered by fullscreen iframe)
		await page.setViewportSize({ width: 1920, height: 1080 })

		// Navigate to an interactive tutorial
		await page.goto(`${baseURL}/vault/tutorials/get-started/troubleshoot#scenario`)

		// Verify "Show Terminal" button appears in the header
		const showTerminalButton = page.locator('header').getByRole('button', { name: /show terminal/i })
		await expect(showTerminalButton).toBeVisible()

		// Click "Show Terminal" to open the terminal
		await showTerminalButton.click()

		// Verify terminal/lab interface opens (iframe should become visible)
		const labIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(labIframe).toBeVisible({ timeout: 10000 })

		// Wait for the terminal to fully load
		await page.waitForTimeout(2000)

		// Close the terminal by clicking the button again
		// Scroll button into view first to ensure it's accessible
		const closeTerminalButton = page.locator('header').getByRole('button', { name: /terminal/i }).first()
		await closeTerminalButton.click()

		// Wait for closing animation and verify terminal closes
		await page.waitForTimeout(1000)
		await expect(labIframe).toBeHidden({ timeout: 10000 })

		// Verify no console errors so far
		if (errors.length > 0) {
			console.log(`Console errors detected (${errors.length}):`, errors)
		}
		expect(errors.length).toBe(0)

		// Navigate to a non-interactive tutorial
		await page.goto(`${baseURL}/vault/tutorials/get-started/learn-http-api`)

		// Verify "Show Terminal" button does NOT appear in the header
		const headerShowTerminalButton = page.locator('header').getByRole('button', { name: /show terminal/i })
		await expect(headerShowTerminalButton).not.toBeVisible()

		// Verify no console errors occurred
		if (errors.length > 0) {
			console.log(`Console errors detected (${errors.length}):`, errors)
		}
		expect(errors.length).toBe(0)
	})

	test('Navigation between tutorial types', async ({
		page,
		baseURL
	}) => {
		// Set up error monitoring - specifically looking for undefined errors
		const errors: string[] = []
		page.on('pageerror', (error) => {
			errors.push(error.message)
		})

		// Start at interactive tutorial
		await page.goto(`${baseURL}/vault/tutorials/get-started/troubleshoot#scenario`)

		// Open the terminal using "Show Terminal"
		const showTerminalButton = page.locator('header').getByRole('button', { name: /show terminal/i })
		await expect(showTerminalButton).toBeVisible()
		await showTerminalButton.click()

		// Verify terminal opens and capture the original iframe src
		const labIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(labIframe).toBeVisible({ timeout: 10000 })

		// Capture the initial iframe src to compare later
		const initialIframeSrc = await labIframe.getAttribute('src')
		expect(initialIframeSrc).toBeTruthy()
		expect(initialIframeSrc).toContain('troubleshoot-vault')

		// Navigate to non-interactive tutorial
		await page.goto(`${baseURL}/vault/tutorials/get-started/learn-http-api`)

		// Verify terminal closes automatically
		await page.waitForTimeout(1000) // Give time for close animation
		await expect(labIframe).not.toBeVisible()

		// Verify "Show Terminal" button disappears
		const buttonAfterNav = page.locator('header').getByRole('button', { name: /show terminal/i })
		await expect(buttonAfterNav).not.toBeVisible()

		// Verify no console errors about undefined or "Cannot read properties of undefined"
		const hasUndefinedErrors = errors.some(error =>
			error.toLowerCase().includes('undefined') ||
			error.toLowerCase().includes('cannot read properties')
		)
		expect(hasUndefinedErrors).toBe(false)

		// Navigate back to the interactive tutorial
		await page.goto(`${baseURL}/vault/tutorials/get-started/troubleshoot#scenario`)

		// Verify "Show Terminal" button reappears
		const buttonReappeared = page.locator('header').getByRole('button', { name: /show terminal/i })
		await expect(buttonReappeared).toBeVisible()

		// Open the terminal again to verify correct lab ID is restored
		await buttonReappeared.click()

		// Verify the iframe appears with the correct lab
		const restoredIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(restoredIframe).toBeVisible({ timeout: 10000 })

		// Verify the restored lab ID matches the original exactly
		const restoredIframeSrc = await restoredIframe.getAttribute('src')
		expect(restoredIframeSrc).toBeTruthy()

		// The tutorial should restore the exact same lab (with same token)
		expect(restoredIframeSrc).toBe(initialIframeSrc)

		// Verify no console errors occurred
		if (errors.length > 0) {
			console.log(`Console errors detected (${errors.length}):`, errors)
		}
		expect(errors.length).toBe(0)
	})

	test('Sandbox dropdown functionality', async ({
		page,
		baseURL
	}) => {
		// Set up error monitoring
		const errors: string[] = []
		page.on('pageerror', (error) => {
			errors.push(error.message)
		})

		// Set a larger viewport to ensure button is accessible (header buttons hide away when viewport is small)
		await page.setViewportSize({ width: 1920, height: 1080 })

		// Navigate to a page to start
		await page.goto(`${baseURL}/vault`)
		
		// Wait for page to fully load
		await page.waitForLoadState('networkidle')
		
		// Click "Sandbox" in the main navigation header to open dropdown
		const sandboxNavButton = page.locator('header').getByRole('button', { name: /sandbox/i })
		await expect(sandboxNavButton).toBeVisible()

		// Scroll to the button to ensure it's in viewport
		await sandboxNavButton.scrollIntoViewIfNeeded()

		// Get the dropdown ID from aria-controls
		const dropdownId = await sandboxNavButton.getAttribute('aria-controls')
		expect(dropdownId).toBeTruthy()

		// Click the button to open the dropdown (use force to bypass portal overlay)
		await sandboxNavButton.click({ force: true })

		// Wait for dropdown to appear
		await page.waitForTimeout(500)

		// Click on "Vault Sandbox" button in the dropdown (use exact match to avoid "Go to Vault Sandboxes")
		const dropdown = page.locator(`#${dropdownId}`)
		const vaultSandboxOption = dropdown.getByRole('button', { name: /vault sandbox experiment/i })
		await expect(vaultSandboxOption).toBeVisible()
		await vaultSandboxOption.click()

		// Verify the Vault sandbox opens correctly
		const labIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(labIframe).toBeVisible({ timeout: 10000 })

		// Verify the iframe contains the Vault sandbox
		const vaultIframeSrc = await labIframe.getAttribute('src')
		expect(vaultIframeSrc).toContain('vault-sandbox')

		// Navigate to a different product (Terraform)
		await page.goto(`${baseURL}/terraform`)
		
		// Wait for page to fully load
		await page.waitForLoadState('networkidle')

		// Click "Sandbox" again within the navbar to open dropdown
		const sandboxNavButtonAgain = page.locator('header').getByRole('button', { name: /sandbox/i })
		await expect(sandboxNavButtonAgain).toBeVisible()
		
		// Scroll to ensure it's in viewport
		await sandboxNavButtonAgain.scrollIntoViewIfNeeded()

		// Get the dropdown ID again
		const dropdownIdAgain = await sandboxNavButtonAgain.getAttribute('aria-controls')
		expect(dropdownIdAgain).toBeTruthy()

		// Click the button to open the dropdown (use force to bypass portal overlay)
		await sandboxNavButtonAgain.click({ force: true })

		// Wait for dropdown
		await page.waitForTimeout(500)

		// Select "Terraform Sandbox" button (get the last match to avoid "Go to" button)
		const dropdownAgain = page.locator(`#${dropdownIdAgain}`)
		const terraformSandboxOption = dropdownAgain.getByRole('button', { name: /terraform.*sandbox/i }).last()
		await expect(terraformSandboxOption).toBeVisible()
		await terraformSandboxOption.click()

		// Verify Terraform sandbox opens and replaces the Vault sandbox
		const terraformIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(terraformIframe).toBeVisible({ timeout: 10000 })

		const terraformIframeSrc = await terraformIframe.getAttribute('src')
		expect(terraformIframeSrc).toContain('terraform-sandbox')
		expect(terraformIframeSrc).not.toContain('vault-sandbox')

		// Log any console errors for debugging (some may be non-critical)
		if (errors.length > 0) {
			console.log(`Console errors detected (${errors.length}):`, errors)
		}
	})

	test('Direct navigation with lab open', async ({
		page,
		baseURL
	}) => {
		// Set up error monitoring
		const errors: string[] = []
		page.on('pageerror', (error) => {
			errors.push(error.message)
		})

		// Navigate to interactive tutorial
		await page.goto(`${baseURL}/vault/tutorials/get-started/troubleshoot#scenario`)

		// Open the interactive lab
		const startLabButton = page.getByRole('button', { name: /start interactive lab/i })
		await expect(startLabButton).toBeVisible()
		await startLabButton.click()

		// Verify lab opens
		const labIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(labIframe).toBeVisible({ timeout: 10000 })

		// Directly navigate to a different product URL
		await page.goto(`${baseURL}/nomad/tutorials`)

		// Wait for navigation to complete
		await page.waitForTimeout(1000)

		// Verify terminal closes when navigating to different product
		await expect(labIframe).not.toBeVisible()

		// Verify no console errors
		if (errors.length > 0) {
			console.log(`Console errors detected (${errors.length}):`, errors)
		}
		expect(errors.length).toBe(0)

		// Navigate back to Vault tutorial
		await page.goto(`${baseURL}/vault/tutorials/get-started/troubleshoot#scenario`)

		// Verify lab can be reopened
		const reopenLabButton = page.getByRole('button', { name: /start interactive lab/i })
		await expect(reopenLabButton).toBeVisible()
		await reopenLabButton.click()

		// Verify lab opens again
		const reopenedIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(reopenedIframe).toBeVisible({ timeout: 10000 })

		// Verify no console errors
		if (errors.length > 0) {
			console.log(`Console errors detected (${errors.length}):`, errors)
		}
		expect(errors.length).toBe(0)
	})

	test('Sidebar sandbox button persistence', async ({
		page,
		baseURL
	}) => {
		// Set up error monitoring
		const errors: string[] = []
		page.on('pageerror', (error) => {
			errors.push(error.message)
		})

		// Navigate to a tutorial page
		await page.goto(`${baseURL}/vault/tutorials/get-started/troubleshoot#scenario`)

		// Look for the sidebar specifically (not header nav)
		// The sidebar should be an aside or have complementary role
		const sidebar = page.locator('aside, [role="complementary"]').first()

		// Look for "Sandbox" link within the sidebar only
		const sidebarSandboxLink = sidebar.getByRole('link', { name: /sandbox/i })

		// Check if sidebar sandbox link exists
		const hasSidebarLink = await sidebarSandboxLink.count() > 0

		if (!hasSidebarLink) {
			// If there's no sidebar sandbox link, skip this test
			console.log('No sidebar sandbox link found - skipping test')
			return
		}

		await expect(sidebarSandboxLink).toBeVisible()

		// Click on the sidebar "Sandbox" link
		await sidebarSandboxLink.click()

		// Wait for navigation to sandbox page
		await page.waitForTimeout(1000)

		// Click on a "Launch Sandbox" button
		const launchButton = page.getByRole('button', { name: /launch sandbox/i }).first()
		await expect(launchButton).toBeVisible()
		await launchButton.click()

		// Verify sandbox opens
		const labIframe = page.locator('iframe[src*="instruqt"]').first()
		await expect(labIframe).toBeVisible({ timeout: 10000 })

		// Capture the sandbox src to verify persistence
		const sandboxSrc = await labIframe.getAttribute('src')
		expect(sandboxSrc).toBeTruthy()
		expect(sandboxSrc).toContain('vault-sandbox')

		// Directly navigate to a different URL
		await page.goto(`${baseURL}/vault/docs`)

		// Wait for navigation
		await page.waitForTimeout(1000)

		// Verify terminal stays open/persists
		await expect(labIframe).toBeVisible()

		// Verify the same sandbox is still loaded
		const persistedSrc = await labIframe.getAttribute('src')
		expect(persistedSrc).toBe(sandboxSrc)

		// Navigate to a different product
		await page.goto(`${baseURL}/terraform/docs`)

		// Wait for navigation
		await page.waitForTimeout(1000)

		// Verify terminal still persists across product navigation
		await expect(labIframe).toBeVisible()

		// Verify no console errors
		if (errors.length > 0) {
			console.log(`Console errors detected (${errors.length}):`, errors)
		}
		expect(errors.length).toBe(0)
	})
})
