/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * We introduced a breaking change to our URL structure in March of 2023
 * that changed the following URL structure of integration component pages to introduce
 * the support for multiple different similarly-typed components:
 *
 * Previous URL structure:
 * /{product}/integrations/{org}/{integration}/{version}/components/{component-type}
 * New URL structure:
 * /{product}/integrations/{org}/{integration}/{version}/components/{component-type}/{component-slug}
 *
 * Prior to this change, we could not support multiple different `builder` components,
 * as our URL struture assumed that there would only be one:
 * /waypoint/integrations/hashicorp/kubernetes/latest/components/builder
 *
 * After this change, we are now able to support multiple `builder` components:
 * /waypoint/integrations/hashicorp/kubernetes/latest/components/builder/builder-one
 * /waypoint/integrations/hashicorp/kubernetes/latest/components/builder/builder-two
 *
 * We need these redirects to ensure that any previous links to these component pages
 * still link to the expected content.
 */
module.exports.integrationMultipleComponentRedirects = [
	waypointComponentRedirect('aws-ami', 'builder', 'aws-ami-builder'),
	waypointComponentRedirect(
		'aws-alb',
		'release-manager',
		'aws-alb-release-manager'
	),
	waypointComponentRedirect('aws-ecr', 'registry', 'aws-ecr-registry'),
	waypointComponentRedirect('aws-ec2', 'platform', 'aws-ec2-platform'),
	waypointComponentRedirect('aws-ecr-pull', 'builder', 'aws-ecr-pull-builder'),
	waypointComponentRedirect('aws-ecs', 'platform', 'aws-ecs-platform'),
	waypointComponentRedirect('aws-ecs', 'task', 'aws-ecs-task'),
	waypointComponentRedirect('aws-lambda', 'platform', 'aws-lambda-platform'),
	waypointComponentRedirect(
		'aws-ssm',
		'config-sourcer',
		'aws-ssm-config-sourcer'
	),
	waypointComponentRedirect('docker-pull', 'builder', 'docker-pull-builder'),
	waypointComponentRedirect(
		'consul',
		'config-sourcer',
		'consul-config-sourcer'
	),
	waypointComponentRedirect('docker-ref', 'builder', 'docker-ref-builder'),
	waypointComponentRedirect(
		'azure-container-instance',
		'platform',
		'azure-container-instance-platform'
	),
	waypointComponentRedirect('docker', 'builder', 'docker-builder'),
	waypointComponentRedirect('docker', 'platform', 'docker-platform'),
	waypointComponentRedirect('docker', 'registry', 'docker-registry'),
	waypointComponentRedirect('docker', 'task', 'docker-task'),
	waypointComponentRedirect(
		'google-cloud-run',
		'platform',
		'google-cloud-run-platform'
	),
	waypointComponentRedirect(
		'google-cloud-run',
		'release-manager',
		'google-cloud-run-release-manager'
	),
	waypointComponentRedirect('files', 'builder', 'files-builder'),
	waypointComponentRedirect('files', 'registry', 'files-registry'),
	waypointComponentRedirect('helm', 'platform', 'helm-platform'),
	waypointComponentRedirect('exec', 'platform', 'exec-platform'),
	waypointComponentRedirect(
		'lambda-function-url',
		'release-manager',
		'lambda-function-url-release-manager'
	),
	waypointComponentRedirect(
		'nomad-jobspec',
		'platform',
		'nomad-jobspec-platform'
	),
	waypointComponentRedirect(
		'kubernetes-apply',
		'platform',
		'kubernetes-apply-platform'
	),
	waypointComponentRedirect(
		'nomad-jobspec-canary',
		'release-manager',
		'nomad-jobspec-canary-release-manager'
	),
	waypointComponentRedirect('nomad', 'platform', 'nomad-platform'),
	waypointComponentRedirect('nomad', 'task', 'nomad-task'),
	waypointComponentRedirect('kubernetes', 'platform', 'kubernetes-platform'),
	waypointComponentRedirect(
		'kubernetes',
		'release-manager',
		'kubernetes-release-manager'
	),
	waypointComponentRedirect(
		'kubernetes',
		'config-sourcer',
		'kubernetes-config-sourcer'
	),
	waypointComponentRedirect('kubernetes', 'task', 'kubernetes-task'),
	waypointComponentRedirect(
		'pack',
		'builder',
		'cloudnative-buildpacks-builder'
	),
	waypointComponentRedirect(
		'packer',
		'config-sourcer',
		'packer-config-sourcer'
	),
	waypointComponentRedirect('vault', 'config-sourcer', 'vault-config-sourcer'),
	waypointComponentRedirect(
		'terraform-cloud',
		'config-sourcer',
		'terraform-cloud-config-sourcer'
	),
]

// Sugar to generateComponentRedirect so I can use this in a one-liner above
// I still want to keep generateComponentRedirect as-is in the event that we
// need to use this redirect logic for another product / situation
function waypointComponentRedirect(integration, componentType, componentSlug) {
	return generateComponentRedirect({
		product: 'waypoint',
		org: 'hashicorp',
		integration,
		componentType,
		componentSlug,
	})
}

function generateComponentRedirect({
	product,
	org,
	integration,
	componentType,
	componentSlug,
}) {
	return {
		source: `/${product}/integrations/${org}/${integration}/latest/components/${componentType}`,
		destination: `/${product}/integrations/${org}/${integration}/latest/components/${componentType}/${componentSlug}`,
		permanent: true,
	}
}
