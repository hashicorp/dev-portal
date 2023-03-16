/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconApi16 } from '@hashicorp/flight-icons/svg-react/api-16'
import { IconAws16 } from '@hashicorp/flight-icons/svg-react/aws-16'
import { IconBoundary16 } from '@hashicorp/flight-icons/svg-react/boundary-16'
import { IconCloud16 } from '@hashicorp/flight-icons/svg-react/cloud-16'
import { IconCode16 } from '@hashicorp/flight-icons/svg-react/code-16'
import { IconConnection16 } from '@hashicorp/flight-icons/svg-react/connection-16'
import { IconConsul16 } from '@hashicorp/flight-icons/svg-react/consul-16'
import { IconDatabase16 } from '@hashicorp/flight-icons/svg-react/database-16'
import { IconDockerColor16 } from '@hashicorp/flight-icons/svg-react/docker-color-16'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconEnterprise16 } from '@hashicorp/flight-icons/svg-react/enterprise-16'
import { IconEntryPoint16 } from '@hashicorp/flight-icons/svg-react/entry-point-16'
import { IconFileSource16 } from '@hashicorp/flight-icons/svg-react/file-source-16'
import { IconGcpColor16 } from '@hashicorp/flight-icons/svg-react/gcp-color-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { IconHandshake16 } from '@hashicorp/flight-icons/svg-react/handshake-16'
import { IconHcp16 } from '@hashicorp/flight-icons/svg-react/hcp-16'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { IconKubernetesColor16 } from '@hashicorp/flight-icons/svg-react/kubernetes-color-16'
import { IconMicrosoftColor16 } from '@hashicorp/flight-icons/svg-react/microsoft-color-16'
import { IconOracleColor16 } from '@hashicorp/flight-icons/svg-react/oracle-color-16'
import { IconOrg16 } from '@hashicorp/flight-icons/svg-react/org-16'
import { IconPacker16 } from '@hashicorp/flight-icons/svg-react/packer-16'
import { IconPlug16 } from '@hashicorp/flight-icons/svg-react/plug-16'
import { IconPlusCircle16 } from '@hashicorp/flight-icons/svg-react/plus-circle-16'
import { IconProvider16 } from '@hashicorp/flight-icons/svg-react/provider-16'
import { IconServer16 } from '@hashicorp/flight-icons/svg-react/server-16'
import { IconTerminal16 } from '@hashicorp/flight-icons/svg-react/terminal-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { IconTerraform16 } from '@hashicorp/flight-icons/svg-react/terraform-16'
import { IconTools16 } from '@hashicorp/flight-icons/svg-react/tools-16'
import { IconVault16 } from '@hashicorp/flight-icons/svg-react/vault-16'
import { IconVmware16 } from '@hashicorp/flight-icons/svg-react/vmware-16'
import { IconWaypoint16 } from '@hashicorp/flight-icons/svg-react/waypoint-16'
import { IconWrench16 } from '@hashicorp/flight-icons/svg-react/wrench-16'

/**
 * @TODO refactor to remove the HashiCorp product logos from this list
 * when product logos are needed, component should use `ProductLogo`
 */

export const SUPPORTED_ICONS = {
	api: <IconApi16 />,
	'aws-color': <IconAws16 />,
	'boundary-color': (
		<IconBoundary16 color={`var(--token-color-boundary-brand)`} />
	),
	cloud: <IconCloud16 />,
	code: <IconCode16 />,
	connection: <IconConnection16 />,
	'consul-color': <IconConsul16 color={`var(--token-color-consul-brand)`} />,
	database: <IconDatabase16 />,
	'docker-color': <IconDockerColor16 />,
	docs: <IconDocs16 />,
	download: <IconDownload16 />,
	enterprise: <IconEnterprise16 />,
	'entry-point': <IconEntryPoint16 />,
	'file-source': <IconFileSource16 />,
	'gcp-color': <IconGcpColor16 />,
	guide: <IconGuide16 />,
	handshake: <IconHandshake16 />,
	hcp: <IconHcp16 />,
	home: <IconHome16 />,
	'kubernetes-color': <IconKubernetesColor16 />,
	'microsoft-color': <IconMicrosoftColor16 />,
	'oracle-color': <IconOracleColor16 />,
	org: <IconOrg16 />,
	'packer-color': <IconPacker16 color={`var(--token-color-packer-brand)`} />,
	plug: <IconPlug16 />,
	'plus-circle': <IconPlusCircle16 />,
	provider: <IconProvider16 />,
	server: <IconServer16 />,
	'terminal-screen': <IconTerminalScreen16 />,
	terminal: <IconTerminal16 />,
	'terraform-color': (
		<IconTerraform16 color={`var(--token-color-terraform-brand)`} />
	),
	tools: <IconTools16 />,
	'vault-color': <IconVault16 color={`var(--token-color-vault-brand)`} />,
	vmware: <IconVmware16 />,
	'waypoint-color': <IconWaypoint16 />,
	wrench: <IconWrench16 />,
}
