/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Joi from 'joi'
import { validateAgainstSchema } from 'lib/validate-against-schema'
import { SandboxConfig } from 'types/sandbox'

// Define the validation schema for sandbox configuration
const sandboxConfigSchema = Joi.object({
	products: Joi.array()
		.items(Joi.string().required())
		.min(1)
		.required()
		.description('Array of supported product slugs'),		labs: Joi.array()
		.items(
			Joi.object({
				title: Joi.string()
					.required()
					.description('Display name for the lab'),
				
				description: Joi.string()
					.required()
					.min(10)
					.max(500)
					.description('Brief description of what the lab provides'),
				
				products: Joi.array()
					.items(Joi.string().required())
					.min(1)
					.required()
					.description('Array of product slugs this lab supports'),
				
				labId: Joi.string()
					.required()
					.pattern(/^[\w-]+$/)
					.description('Unique identifier for the lab'),
				
				instruqtTrack: Joi.string()
					.required()
					.pattern(/^[\w-]+\/[\w-]+\/[\w-]+$/)
					.description('Instruqt track path (e.g., hashicorp-learn/tracks/terraform-sandbox)'),
				
				scenario: Joi.string()
					.optional()
					.description('Optional scenario parameter for the lab'),
				
				documentation: Joi.string()
					.optional()
					.pattern(/\.mdx?$/)
					.description('Optional path to MDX documentation file')
			}).required()
		)
		.min(1)
		.required()
		.description('Array of available sandbox labs')
})

/**
 * Validates sandbox configuration against the schema
 * @param config - Raw configuration object to validate
 * @param sourceFile - Source file path for error reporting
 * @returns Validated configuration object
 * @throws Error if validation fails
 */
export function validateSandboxConfig(
	config: unknown,
	sourceFile: string = 'sandbox.json'
): SandboxConfig {
	validateAgainstSchema<SandboxConfig>(config, sandboxConfigSchema, sourceFile)
	
	const validatedConfig = config as SandboxConfig
	
	// Additional custom validations
	validateProductConsistency(validatedConfig, sourceFile)
	validateUniqueLabIds(validatedConfig, sourceFile)
	
	return validatedConfig
}

/**
 * Ensures all lab products are listed in the global products array
 */
function validateProductConsistency(config: SandboxConfig, sourceFile: string): void {
	const globalProducts = new Set(config.products)
	const invalidLabs: string[] = []
	
	config.labs.forEach(lab => {
		const unsupportedProducts = lab.products.filter(product => !globalProducts.has(product))
		if (unsupportedProducts.length > 0) {
			invalidLabs.push(`Lab "${lab.title}" references unsupported products: ${unsupportedProducts.join(', ')}`)
		}
	})
	
	if (invalidLabs.length > 0) {
		throw new Error(
			`Invalid sandbox configuration in ${sourceFile}:\n${invalidLabs.join('\n')}\n\nAll lab products must be listed in the global products array.`
		)
	}
}

/**
 * Ensures all lab IDs are unique
 */
function validateUniqueLabIds(config: SandboxConfig, sourceFile: string): void {
	const labIds = new Set<string>()
	const duplicateIds: string[] = []
	
	config.labs.forEach(lab => {
		if (labIds.has(lab.labId)) {
			duplicateIds.push(lab.labId)
		} else {
			labIds.add(lab.labId)
		}
	})
	
	if (duplicateIds.length > 0) {
		throw new Error(
			`Invalid sandbox configuration in ${sourceFile}:\nDuplicate lab IDs found: ${duplicateIds.join(', ')}\n\nEach lab must have a unique ID.`
		)
	}
}

/**
 * Runtime configuration validator that can be used during development
 * Provides detailed error reporting for configuration issues
 */
export function validateSandboxConfigWithDetailedErrors(config: unknown): {
	isValid: boolean
	errors: string[]
	warnings: string[]
} {
	const errors: string[] = []
	const warnings: string[] = []
	
	try {
		validateSandboxConfig(config, 'runtime validation')
		return { isValid: true, errors: [], warnings }
	} catch (error) {
		if (error instanceof Error) {
			errors.push(error.message)
		} else {
			errors.push('Unknown validation error occurred')
		}
		
		return { isValid: false, errors, warnings }
	}
}

/**
 * Validates a single lab configuration
 * Useful for dynamic lab additions or testing
 */
export function validateSandboxLab(lab: unknown, availableProducts: string[]): {
	isValid: boolean
	errors: string[]
} {
	const errors: string[] = []
	
	const labSchema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required().min(10).max(500),
		products: Joi.array().items(
			Joi.string().valid(...availableProducts)
		).min(1).required(),
		labId: Joi.string().required().pattern(/^[\w/-]+$/),
		instruqtTrack: Joi.string()
			.required()
			.pattern(/^[\w-]+\/[\w-]+\/[\w-]+$/),
		scenario: Joi.string().optional(),
		documentation: Joi.string().optional().pattern(/\.mdx?$/)
	})
	
	const { error } = labSchema.validate(lab)
	
	if (error) {
		errors.push(`Lab validation failed: ${error.message}`)
		return { isValid: false, errors }
	}
	
	return { isValid: true, errors: [] }
}
