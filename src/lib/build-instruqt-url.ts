/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { SandboxLab } from 'types/sandbox'

interface InstruqtTokens {
	[key: string]: string
}

interface BasicLab {
	labId: string
	instruqtTrack: string
	scenario?: string
}

/**
 * Tracks Instruqt URL building errors with PostHog and development logging
 */
const trackInstruqtUrlError = (
	errorType: string,
	errorMessage: string,
	context?: Record<string, unknown>
) => {
	// Track error in PostHog for production monitoring
	if (typeof window !== 'undefined' && window.posthog?.capture) {
		window.posthog.capture('instruqt_url_build_error', {
			error_type: errorType,
			error_message: errorMessage,
			timestamp: new Date().toISOString(),
			page_url: window.location.href,
			...context,
		})
	}

	if (process.env.NODE_ENV === 'development') {
		console.error(`[InstruqtUrlBuilder] ${errorMessage}`, context)
	}
}

// Get default tokens from environment variables with fallbacks
const getDefaultTokens = (): InstruqtTokens => ({
	'terraform-sandbox': 'em_3vgTsBqCLq2blqtQ',
	'vault-sandbox': 'em_CUFCBU0nSfCl2VHi',
	'boundary-sandbox': 'em_YHsmJu4K1Wk3hwht',
	'consul-sandbox-sd': 'em_MdAn4Od_foU6oybz',
	'consul-sandbox': 'em_I5XI2XjO-ZMeH1_w',
	'nomad-sandbox': 'em_0wOuIAyyjAQllLkc',
})

/**
 * Builds the lab ID that will be used by the Instruqt embed
 * This combines the track path with query parameters
 * @param lab - The sandbox lab configuration (can be basic or full SandboxLab)
 * @param customTokens - Optional custom token mapping
 * @returns The complete lab ID for Instruqt embedding
 */
export function buildLabId(
	lab: BasicLab | SandboxLab,
	customTokens?: InstruqtTokens
): string {
	try {
		if (!lab) {
			trackInstruqtUrlError(
				'null_lab_config',
				'Lab configuration is null or undefined',
				{
					custom_tokens_provided: !!customTokens,
				}
			)
			return ''
		}

		if (!lab.instruqtTrack) {
			trackInstruqtUrlError(
				'missing_instruqt_track',
				'Lab instruqtTrack is missing',
				{
					lab_id: lab.labId,
					lab_has_scenario: !!lab.scenario,
					custom_tokens_provided: !!customTokens,
				}
			)
			return lab.labId || ''
		}

		const tokens = { ...getDefaultTokens(), ...customTokens }

		// Build the track URL with parameters
		let labId = lab.instruqtTrack

		// Add token parameter
		const trackName = lab.instruqtTrack.split('/').pop() || ''
		const token =
			process.env.INSTRUQT_TOKEN ||
			tokens[trackName] ||
			tokens[lab.labId] ||
			null

		if (token) {
			labId += `?token=${token}`
		}

		// Add scenario parameter if specified
		if (lab.scenario) {
			const separator = token ? '&' : '?'
			labId += `${separator}rtp_SCENARIO=${lab.scenario}`
		}

		return labId
	} catch (error) {
		trackInstruqtUrlError(
			'build_lab_id_exception',
			'Unexpected error building lab ID',
			{
				error_message: error instanceof Error ? error.message : String(error),
				error_stack: error instanceof Error ? error.stack : undefined,
				lab_id: lab?.labId,
				instruqt_track: lab?.instruqtTrack,
				has_scenario: !!lab?.scenario,
				custom_tokens_provided: !!customTokens,
			}
		)
		return lab?.labId || ''
	}
}

/**
 * Server-side function to build lab ID with config
 *
 */
export function buildLabIdWithConfig(lab: BasicLab | SandboxLab): string {
	try {
		return buildLabId(lab)
	} catch (error) {
		trackInstruqtUrlError(
			'build_lab_id_with_config_exception',
			'Unexpected error building lab ID with config',
			{
				error_message: error instanceof Error ? error.message : String(error),
				error_stack: error instanceof Error ? error.stack : undefined,
				lab_id: lab?.labId,
				instruqt_track: lab?.instruqtTrack,
				has_scenario: !!lab?.scenario,
			}
		)
		return lab?.labId || ''
	}
}
