/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'

/**
 * List of dev-portal paths and expected H1's.
 */

// this currently contains the first collection for each product and the first 2 tutorials
const table = [
	[
		'/boundary/tutorials/credential-management',
		'Credential Management Workflows',
	],
	[
		'/boundary/tutorials/credential-management/hcp-vault-cred-brokering-quickstart',
		'HCP Boundary Vault Credential Brokering Quickstart',
	],
	[
		'/boundary/tutorials/credential-management/hcp-certificate-injection',
		'SSH Certificate Injection with HCP Boundary',
	],
	['/hcp/tutorials/networking', 'HashiCorp Virtual Network'],
	[
		'/hcp/tutorials/networking/amazon-peering-hcp',
		'Peering an AWS VPC with HashiCorp Cloud Platform (HCP)',
	],
	[
		'/hcp/tutorials/networking/azure-peering-hcp',
		'Peering an Azure Virtual Network with HashiCorp Cloud Platform (HCP)',
	],
	[
		'/onboarding/consul-enterprise-week-1',
		'Consul Enterprise Week 1 Onboarding Journey',
	],
	[
		'/onboarding/consul-enterprise-week-1/consul-enterprise-w1-welcome',
		'Week 1 - Welcome to Consul Enterprise',
	],
	[
		'/onboarding/consul-enterprise-week-1/reference-architecture',
		'Consul Reference Architecture',
	],
	['/nomad/tutorials/access-control', 'Secure Nomad with Access Control'],
	[
		'/nomad/tutorials/access-control/access-control',
		'Nomad ACL System Fundamentals',
	],
	[
		'/nomad/tutorials/access-control/access-control-bootstrap',
		'Bootstrap Nomad ACL System',
	],
	[
		'/consul/tutorials/certification-associate-tutorials',
		'Associate Tutorial List',
	],
	[
		'/consul/tutorials/certification-associate-tutorials/reference-architecture',
		'Consul Reference Architecture',
	],
	[
		'/consul/tutorials/certification-associate-tutorials/federation-gossip-wan',
		'Federate Multiple Datacenters Using WAN Gossip',
	],
	['/vagrant/tutorials/getting-started', 'Get Started'],
	[
		'/vagrant/tutorials/getting-started/getting-started-index',
		'What is Vagrant?',
	],
	[
		'/vagrant/tutorials/getting-started/getting-started-install',
		'Install Vagrant',
	],
	['/packer/tutorials/aws-get-started', 'Getting Started with AWS'],
	[
		'/packer/tutorials/aws-get-started/get-started-install-cli',
		'Install Packer',
	],
	[
		'/packer/tutorials/aws-get-started/aws-get-started-build-image',
		'Build an Image',
	],
	['/terraform/tutorials/0-14', 'Terraform 0.14 tutorials'],
	[
		'/terraform/tutorials/0-14/sensitive-variables',
		'Protect Sensitive Input Variables',
	],
	[
		'/terraform/tutorials/0-14/provider-versioning',
		'Lock and Upgrade Provider Versions',
	],
	['/vault/tutorials/app-integration', 'App Integration'],
	[
		'/vault/tutorials/app-integration/secure-introduction',
		'Secure Introduction of Vault Clients',
	],
	[
		'/vault/tutorials/app-integration/application-integration',
		'Use Consul Template and Envconsul with Vault',
	],
	['/waypoint/tutorials/application-deployment', 'Application Deployment'],
	[
		'/waypoint/tutorials/application-deployment/gitops-helm-deployment',
		'Deploy a Helm-based application automatically with GitOps',
	],
	['/well-architected-framework/com', 'Cloud Operating Model'],
	[
		'/well-architected-framework/com/cloud-operating-model',
		'What is the Cloud Operating Model?',
	],
	[
		'/well-architected-framework/com/implement-cloud-operating-model',
		'HashiCorp Well-Architected Framework Introduction',
	],
]

// This is an integration test with the downstream `learn-api`.
// This test primarily exists to ensure paths render correct tutorials. Incorrect tutorials have
// been observed when upgrading Next.js from `13.0.8` to `13.4.8`
for (const row of table) {
	const [path, firstH1] = row

	test(`${path} should contain h1 (${firstH1})`, async ({ page }) => {
		await page.goto(path)
		const h1 = await page.waitForSelector('h1')
		const text = await h1.innerText()
		expect(text).toEqual(firstH1)
	})
}
