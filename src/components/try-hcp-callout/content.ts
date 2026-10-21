/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { TryHcpCalloutProps } from 'components/try-hcp-callout/types'
import { ProductSlugWithContent } from './types'

type HcpCalloutContent = Pick<
	TryHcpCalloutProps,
	'heading' | 'description' | 'ctaText' | 'ctaUrl' | 'image'
>

/**
 * Type guard to determine if a string is a ProductSlugWithContent
 */
export function hasHcpCalloutContent(s: string): s is ProductSlugWithContent {
	return tryHcpCalloutContent[s] !== undefined
}

export const tryHcpCalloutContent: Record<
	Exclude<
		ProductSlugWithContent,
		'well-architected-framework' | 'validated-patterns' | 'validated-designs'
	>,
	HcpCalloutContent
> = {
	terraform: {
		heading: 'HCP Terraform',
		description: 'Automate your infrastructure provisioning at any scale',
		ctaText: 'Try HCP Terraform for free',
		ctaUrl: 'https://app.terraform.io/public/signup/account',
		image:
			'img/terraform/try-hcp-callout.svg',
	},
	boundary: {
		heading: 'HCP Boundary',
		description: 'Securely connect to clouds and remote hosts',
		ctaText: 'Try HCP Boundary for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'img/boundary/try-hcp-callout.svg',
	},
	packer: {
		heading: 'HCP Packer',
		description: 'Automate build management across your cloud providers',
		ctaText: 'Try HCP Packer for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'img/packer/try-hcp-callout.svg',
	},
	vault: {
		heading: 'HCP Vault Dedicated',
		description: 'Secure your applications and protect sensitive data',
		ctaText: 'Try HCP Vault Dedicated for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'img/vault/try-hcp-callout.svg',
	},
	'vault-radar': {
		heading: 'HCP Vault Radar',
		description: 'Monitor secrets sprawl and detect exposure across environments',
		ctaText: 'Try HCP Vault Radar for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'img/vault/try-hcp-callout.svg',
	},
	waypoint: {
		heading: 'HCP Waypoint',
		description: 'Simplify your application deployments across platforms',
		ctaText: 'Try HCP Waypoint for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'img/waypoint/try-hcp-callout.svg',
	},
	hcp: {
		heading: 'HashiCorp Cloud Platform',
		description: 'The fastest way to get up and running with HashiCorp tools',
		ctaText: 'Try cloud for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'img/vault/try-hcp-callout.svg',
	},
	vagrant: {
		heading: 'HCP Vagrant Registry',
		description:
			'Virtual boxes for Linux, Laravel and any development environment',
		ctaText: 'Try HCP Vagrant Registry for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/vagrant/discover',
		image:
			'img/vagrant/try-hcp-callout.svg',
	},
}
