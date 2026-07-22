/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

export interface CertificationHeroProps {
	eyebrow?: string
	heading: string
	description: string
	leftCta?: {
		text: string,
		link: string
	}
	rightCta?: {
		text: string,
		link: string
	}
}
