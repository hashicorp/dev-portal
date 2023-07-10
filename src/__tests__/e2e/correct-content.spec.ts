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
	['/cloud/tutorials/networking', 'HashiCorp Virtual Network'],
	[
		'/cloud/tutorials/networking/amazon-peering-hcp',
		'Peering an AWS VPC with HashiCorp Cloud Platform (HCP)',
	],
	[
		'/cloud/tutorials/networking/azure-peering-hcp',
		'Peering an Azure Virtual Network with HashiCorp Cloud Platform (HCP)',
	],
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
		'/onboarding/tutorials/consul-enterprise-week-1',
		'Consul Enterprise Week 1 Onboarding Journey',
	],
	[
		'/onboarding/tutorials/consul-enterprise-week-1/consul-enterprise-w1-welcome',
		'Week 1 - Welcome to Consul Enterprise',
	],
	[
		'/onboarding/tutorials/consul-enterprise-week-1/reference-architecture',
		'Consul Reference Architecture',
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
	['/packer/tutorials/aws-get-started', 'Getting Started with AWS'],
	[
		'/packer/tutorials/aws-get-started/get-started-install-cli',
		'Install Packer',
	],
	[
		'/packer/tutorials/aws-get-started/aws-get-started-build-image',
		'Build an Image',
	],
	[
		'/vagrant/tutorials/networking-provisioning-operations',
		'Networking and Provisioning Environments',
	],
	[
		'/vagrant/tutorials/networking-provisioning-operations/getting-started-provisioning',
		'Provision a Virtual Machine',
	],
	[
		'/vagrant/tutorials/networking-provisioning-operations/getting-started-networking',
		'Configure the Network',
	],
	['/terraform/tutorials/0-13', 'Terraform 0.13 tutorials'],
	['/terraform/tutorials/0-13/count', 'Manage Similar Resources with Count'],
	[
		'/terraform/tutorials/0-13/for-each',
		'Manage Similar Resources with For Each',
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
	['/vault/tutorials/adp', 'Advanced Data Protection'],
	['/vault/tutorials/adp/transform', 'Transform Secrets Engine'],
	[
		'/vault/tutorials/adp/tokenization',
		'Tokenize Data with Transform Secrets Engine',
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
