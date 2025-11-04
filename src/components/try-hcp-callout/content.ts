/**
 * Copyright (c) HashiCorp, Inc.
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
		'well-architected-framework' | 'validated-patterns'
	>,
	HcpCalloutContent
> = {
	terraform: {
		heading: 'HCP Terraform',
		description: 'Automate your infrastructure provisioning at any scale',
		ctaText: 'Try HCP Terraform for free',
		ctaUrl: 'https://app.terraform.io/public/signup/account',
		image:
			'https://www.datocms-assets.com/2885/1721073680-devdot-try-hcp-callout-ui-mock-terraform.svg',
	},
	boundary: {
		heading: 'HCP Boundary',
		description: 'Securely connect to clouds and remote hosts',
		ctaText: 'Try HCP Boundary for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'https://www.datocms-assets.com/2885/1721073666-devdot-try-hcp-callout-ui-mock-boundary.svg',
	},
	consul: {
		heading: 'HCP Consul Dedicated',
		description: 'Discover and securely connect your applications',
		ctaText: 'Try HCP Consul Dedicated for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'https://www.datocms-assets.com/2885/1721073672-devdot-try-hcp-callout-ui-mock-consul.svg',
	},
	packer: {
		heading: 'HCP Packer',
		description: 'Automate build management across your cloud providers',
		ctaText: 'Try HCP Packer for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'https://www.datocms-assets.com/2885/1721073676-devdot-try-hcp-callout-ui-mock-packer.svg',
	},
	vault: {
		heading: 'HCP Vault Dedicated',
		description: 'Secure your applications and protect sensitive data',
		ctaText: 'Try HCP Vault Dedicated for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'https://www.datocms-assets.com/2885/1721073685-devdot-try-hcp-callout-ui-mock-vault.svg',
	},
	waypoint: {
		heading: 'HCP Waypoint',
		description: 'Simplify your application deployments across platforms',
		ctaText: 'Try HCP Waypoint for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'https://www.datocms-assets.com/2885/1721073687-devdot-try-hcp-callout-ui-mock-waypoint.svg',
	},
	hcp: {
		heading: 'HashiCorp Cloud Platform',
		description: 'The fastest way to get up and running with HashiCorp tools',
		ctaText: 'Try cloud for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image:
			'https://www.datocms-assets.com/2885/1721073685-devdot-try-hcp-callout-ui-mock-vault.svg',
	},
	vagrant: {
		heading: 'HCP Vagrant Registry',
		description:
			'Virtual boxes for Linux, Laravel and any development environment',
		ctaText: 'Try HCP Vagrant Registry for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/vagrant/discover',
		image:
			'https://www.datocms-assets.com/2885/1721073683-devdot-try-hcp-callout-ui-mock-vagrant.svg',
	},
}
