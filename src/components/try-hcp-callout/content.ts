/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TryHcpCalloutProps } from 'components/try-hcp-callout/types'
import { ProductSlugWithContent } from './types'

type HcpCalloutContent = Pick<
	TryHcpCalloutProps,
	'heading' | 'description' | 'ctaText' | 'ctaUrl'
>

/**
 * Type guard to determine if a string is a ProductSlugWithContent
 */
export function hasHcpCalloutContent(s: string): s is ProductSlugWithContent {
	return tryHcpCalloutContent[s] !== undefined
}

export const tryHcpCalloutContent: Record<
	ProductSlugWithContent,
	HcpCalloutContent
> = {
	terraform: {
		heading: 'HCP Terraform',
		description: 'Automate your infrastructure provisioning at any scale',
		ctaText: 'Try HCP Terraform for free',
		ctaUrl: 'https://app.terraform.io/public/signup/account',
	},
	boundary: {
		heading: 'HCP Boundary',
		description: 'Securely connect to clouds and remote hosts',
		ctaText: 'Try HCP Boundary for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
	},
	consul: {
		heading: 'HCP Consul',
		description: 'Discover and securely connect your applications',
		ctaText: 'Try HCP Consul for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
	},
	packer: {
		heading: 'HCP Packer',
		description: 'Automate build management across your cloud providers',
		ctaText: 'Try HCP Packer for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
	},
	vault: {
		heading: 'HCP Vault',
		description: 'Secure your applications and protect sensitive data',
		ctaText: 'Try HCP Vault for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
	},
	waypoint: {
		heading: 'HCP Waypoint',
		description: 'Simplify your application deployments across platforms',
		ctaText: 'Try HCP Waypoint for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
	},
	hcp: {
		heading: 'HashiCorp Cloud Platform',
		description: 'The fastest way to get up and running with HashiCorp tools',
		ctaText: 'Try cloud for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
	},
	vagrant: {
		heading: 'Vagrant Cloud',
		description:
			'Virtual boxes for Linux, Laravel and any development environment',
		ctaText: 'Try Vagrant Cloud for free',
		ctaUrl: 'https://app.vagrantup.com/boxes/search',
	},
}
