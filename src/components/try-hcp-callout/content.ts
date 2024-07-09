/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TryHcpCalloutProps } from 'components/try-hcp-callout/types'
import { ProductSlugWithContent } from './types'
import boundarySvg from './components/try-hcp-callout/img/try-hcp-callout-ui-mock-boundary.svg?include'
import consulSvg from './components/try-hcp-callout/img/try-hcp-callout-ui-mock-consul.svg?include'
import packerSvg from './components/try-hcp-callout/img/try-hcp-callout-ui-mock-packer.svg?include'
import terraformSvg from './components/try-hcp-callout/img/try-hcp-callout-ui-mock-terraform.svg?include'
import vagrantSvg from './components/try-hcp-callout/img/try-hcp-callout-ui-mock-vagrant.svg?include'
import vaultSvg from './components/try-hcp-callout/img/try-hcp-callout-ui-mock-vault.svg?include'
import waypointSvg from './components/try-hcp-callout/img/try-hcp-callout-ui-mock-waypoint.svg?include'

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
	ProductSlugWithContent,
	HcpCalloutContent
> = {
	terraform: {
		heading: 'HCP Terraform',
		description: 'Automate your infrastructure provisioning at any scale',
		ctaText: 'Try HCP Terraform for free',
		ctaUrl: 'https://app.terraform.io/public/signup/account',
		image: terraformSvg,
	},
	boundary: {
		heading: 'HCP Boundary',
		description: 'Securely connect to clouds and remote hosts',
		ctaText: 'Try HCP Boundary for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image: boundarySvg,
	},
	consul: {
		heading: 'HCP Consul Dedicated',
		description: 'Discover and securely connect your applications',
		ctaText: 'Try HCP Consul Dedicated for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image: consulSvg,
	},
	packer: {
		heading: 'HCP Packer',
		description: 'Automate build management across your cloud providers',
		ctaText: 'Try HCP Packer for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image: packerSvg,
	},
	vault: {
		heading: 'HCP Vault Dedicated',
		description: 'Secure your applications and protect sensitive data',
		ctaText: 'Try HCP Vault Dedicated for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image: vaultSvg,
	},
	waypoint: {
		heading: 'HCP Waypoint',
		description: 'Simplify your application deployments across platforms',
		ctaText: 'Try HCP Waypoint for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image: waypointSvg,
	},
	hcp: {
		heading: 'HashiCorp Cloud Platform',
		description: 'The fastest way to get up and running with HashiCorp tools',
		ctaText: 'Try cloud for free',
		ctaUrl: 'https://portal.cloud.hashicorp.com/sign-up',
		image: vaultSvg,
	},
	vagrant: {
		heading: 'Vagrant Cloud',
		description:
			'Virtual boxes for Linux, Laravel and any development environment',
		ctaText: 'Try Vagrant Cloud for free',
		ctaUrl: 'https://app.vagrantup.com/boxes/search',
		image: vagrantSvg,
	},
}
