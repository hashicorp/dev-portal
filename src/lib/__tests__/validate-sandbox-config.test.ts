/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { validateSandboxConfigWithDetailedErrors, validateSandboxConfig, validateSandboxLab } from '../validate-sandbox-config'

describe('validateSandboxConfig', () => {
	const validConfig = {
		products: ['terraform', 'vault'],
		labs: [
			{
				title: 'Terraform Sandbox',
				description: 'A comprehensive Terraform sandbox environment for learning',
				products: ['terraform'],
				labId: 'terraform-sandbox',
				instruqtTrack: 'hashicorp-learn/tracks/terraform-sandbox',
				documentation: 'terraform.mdx'
			},
			{
				title: 'Vault Sandbox',
				description: 'Learn Vault secrets management',
				products: ['vault'],
				labId: 'vault-sandbox',
				instruqtTrack: 'hashicorp-learn/tracks/vault-sandbox'
			}
		]
	}

	describe('validateSandboxConfigWithDetailedErrors', () => {
		it('should validate a correct configuration', () => {
			const result = validateSandboxConfigWithDetailedErrors(validConfig)
			
			expect(result.isValid).toBe(true)
			expect(result.errors).toHaveLength(0)
			expect(result.warnings).toHaveLength(0)
		})

		it('should reject null/undefined config', () => {
			const result = validateSandboxConfigWithDetailedErrors(null)
			
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0]).toContain('must be of type object')
		})

		it('should reject config without labs', () => {
			const config = { products: ['terraform'] }
			const result = validateSandboxConfigWithDetailedErrors(config)
			
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0]).toContain('labs')
		})

		it('should warn about empty labs array', () => {
			const config = { products: ['terraform'], labs: [] }
			const result = validateSandboxConfigWithDetailedErrors(config)
			
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should detect missing lab properties', () => {
			const config = {
				products: ['terraform'],
				labs: [{}]
			}
			const result = validateSandboxConfigWithDetailedErrors(config)
			
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should detect invalid products array', () => {
			const config = {
				products: ['terraform'],
				labs: [{
					title: 'Test',
					description: 'Test description that is long enough to pass validation',
					products: ['invalid-product'], // This product is not in the global products array
					labId: 'test-track-id',
					instruqtTrack: 'hashicorp-learn/tracks/test-track'
				}]
			}
			const result = validateSandboxConfigWithDetailedErrors(config)
			
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0]).toContain('unsupported products')
		})

		it('should detect duplicate lab IDs', () => {
			const config = {
				products: ['terraform'],
				labs: [
					{
						title: 'Test 1',
						description: 'Test description that is long enough',
						products: ['terraform'],
						labId: 'duplicate-track-id',
						instruqtTrack: 'hashicorp-learn/tracks/duplicate-track-1'
					},
					{
						title: 'Test 2',
						description: 'Test description that is long enough',
						products: ['terraform'],
						labId: 'duplicate-track-id',
						instruqtTrack: 'hashicorp-learn/tracks/duplicate-track-2'
					}
				]
			}
			const result = validateSandboxConfigWithDetailedErrors(config)
			
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0]).toContain('Duplicate lab IDs')
		})
	})

	describe('validateSandboxConfig', () => {
		it('should return validated config for valid input', () => {
			const result = validateSandboxConfig(validConfig)
			expect(result).toEqual(validConfig)
		})

		it('should throw error for invalid config', () => {
			expect(() => validateSandboxConfig(null)).toThrow()
		})
	})

	describe('validateSandboxLab', () => {
		const availableProducts = ['terraform', 'vault', 'consul']

		it('should validate correct lab', () => {
			const lab = validConfig.labs[0]
			const result = validateSandboxLab(lab, availableProducts)
			
			expect(result.isValid).toBe(true)
			expect(result.errors).toHaveLength(0)
		})

		it('should detect missing required fields', () => {
			const lab = { title: 'Test' }
			const result = validateSandboxLab(lab, availableProducts)
			
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0]).toContain('Lab validation failed')
		})

		it('should handle null lab', () => {
			const result = validateSandboxLab(null, availableProducts)
			
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0]).toContain('Lab validation failed')
		})

		it('should reject lab with invalid product', () => {
			const lab = {
				title: 'Test Lab',
				description: 'A test lab for validation',
				products: ['invalid-product'],
				labId: 'test/org/lab-id'
			}
			
			const result = validateSandboxLab(lab, availableProducts)
			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should validate lab with correct products', () => {
			const lab = {
				title: 'Valid Lab',
				description: 'A lab with valid products',
				products: ['terraform', 'vault'],
				labId: 'hashicorp/org/valid-lab',
				instruqtTrack: 'hashicorp/org/valid-lab'
			}
			
			const result = validateSandboxLab(lab, availableProducts)
			expect(result.isValid).toBe(true)
			expect(result.errors).toHaveLength(0)
		})
	})
})
