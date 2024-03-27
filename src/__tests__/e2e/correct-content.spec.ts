/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'

/**
 * List of dev-portal paths and expected H1's.
 */

// First 2 alphabetical collections for each product & the first 3 tutorials for each
// This test and list should be treated as ephemeral as collections and tutorials are subject to change, making this
// list out of date.
const table = [
	['/hcp/tutorials/consul-cloud', 'HashiCorp Cloud Platform'],
	[
		'/hcp/tutorials/consul-cloud/amazon-peering-hcp',
		'Peering an AWS VPC with HashiCorp Cloud Platform (HCP)',
	],
	['/hcp/tutorials/consul-cloud/consul-deploy', 'Deploy HCP Consul'],
	[
		'/hcp/tutorials/consul-cloud/consul-client-aws-ec2',
		'Configure EC2 as a Consul Client for HCP Consul',
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
		'/hcp/tutorials/networking/amazon-transit-gateway',
		'Connect an Amazon Transit Gateway to your HashiCorp Virtual Network',
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
	[
		'/boundary/tutorials/credential-management/hcp-private-vault-cred-injection',
		'HCP Credential Injection with Private Vault',
	],
	['/boundary/tutorials/enterprise', 'Boundary Enterprise'],
	[
		'/boundary/tutorials/enterprise/hashicorp-enterprise-license',
		'Install a HashiCorp Enterprise License',
	],
	[
		'/boundary/tutorials/enterprise/ent-reference-architecture',
		'Boundary Enterprise Reference Architecture',
	],
	[
		'/boundary/tutorials/enterprise/ent-deployment-guide',
		'Boundary Enterprise Deployment Guide',
	],
	[
		'/nomad/tutorials/advanced-scheduling',
		'Define Application Placement Preferences',
	],
	[
		'/nomad/tutorials/advanced-scheduling/advanced-scheduling',
		'Advanced Scheduling with Nomad',
	],
	[
		'/nomad/tutorials/advanced-scheduling/preemption',
		'Prevent Priority Inversion with Preemption',
	],
	[
		'/nomad/tutorials/advanced-scheduling/affinity',
		'Express Job Placement Preferences with Affinities',
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
		'/nomad/tutorials/access-control/access-control-policies',
		'Nomad ACL Policy Concepts',
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
	[
		'/consul/tutorials/certification-associate-tutorials/deployment-guide',
		'Deployment Guide',
	],
	['/consul/tutorials/certification', 'Prepare for Consul Certification'],
	[
		'/consul/tutorials/certification/associate-study',
		'Study Guide - Consul Associate Certification',
	],
	[
		'/consul/tutorials/certification/associate-questions',
		'Sample Questions - Consul Associate Certification',
	],
	[
		'/consul/tutorials/certification/associate-review',
		'Review Guide - Consul Associate Certification',
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
	['/packer/tutorials/aws-get-started/aws-get-started-provision', 'Provision'],
	['/packer/tutorials/cloud-production', 'Use Cases'],
	[
		'/packer/tutorials/cloud-production/golden-image-with-hcp-packer',
		'Build a Golden Image Pipeline with HCP Packer',
	],
	[
		'/packer/tutorials/cloud-production/multicloud',
		'Standardize Machine Images Across Multiple Cloud Providers',
	],
	[
		'/packer/tutorials/cloud-production/github-actions',
		'Automate Packer with GitHub Actions',
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
	[
		'/onboarding/consul-enterprise-week-1/kubernetes-minikube',
		'Consul Service Discovery and Service Mesh on Minikube',
	],
	[
		'/onboarding/consul-enterprise-week-2',
		'Consul Enterprise Week 2 Onboarding Journey',
	],
	[
		'/onboarding/consul-enterprise-week-2/consul-enterprise-w2-welcome',
		'Week 2 - Welcome to Consul Enterprise',
	],
	[
		'/onboarding/consul-enterprise-week-2/virtual-machine-gs-service-discovery',
		'Register your services to Consul',
	],
	[
		'/onboarding/consul-enterprise-week-2/consul-enterprise-service-definitions',
		'Register Services with Service Definitions',
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
	[
		'/vagrant/tutorials/getting-started/getting-started-project-setup',
		'Initialize a Project Directory',
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
	[
		'/vagrant/tutorials/networking-provisioning-operations/getting-started-providers',
		'Explore Other Providers',
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
	['/terraform/tutorials/0-13', 'Terraform 0.13 tutorials'],
	['/terraform/tutorials/0-13/count', 'Manage Similar Resources with Count'],
	[
		'/terraform/tutorials/0-13/for-each',
		'Manage Similar Resources with For Each',
	],
	[
		'/terraform/tutorials/0-13/cloud-login',
		'Log in to Terraform Cloud from the CLI',
	],
	['/waypoint/tutorials/configuration', 'Configuration'],
	[
		'/waypoint/tutorials/configuration/static-application-configuration',
		'Static Application Configuration',
	],
	['/waypoint/tutorials/configuration/input-variables', 'Input Variables'],
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
	['/well-architected-framework/nomad', 'Nomad'],
	[
		'/well-architected-framework/nomad/production-reference-architecture-vm-with-consul',
		'Nomad Reference Architecture',
	],
	['/vault/tutorials/adp', 'Advanced Data Protection'],
	['/vault/tutorials/adp/transform', 'Transform Secrets Engine'],
	[
		'/vault/tutorials/adp/tokenization',
		'Tokenize Data with Transform Secrets Engine',
	],
	[
		'/vault/tutorials/adp/transform-code-example',
		'Encrypting data with Transform secrets engine',
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
	[
		'/vault/tutorials/app-integration/approle-trusted-entities',
		'AppRole With Terraform & Chef',
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
