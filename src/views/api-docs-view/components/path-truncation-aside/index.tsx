/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import DevDotContent from 'components/dev-dot-content'
import CodeBlock from '@hashicorp/react-code-block'

/**
 * Truncates HCP Vault Secrets API operation paths for clarity.
 * Intended to be used with a `<PathTruncationAside />` in each operation intro.
 *
 * This regex matches a standard prefix in HCP Vault Secrets API paths:
 * /secrets/<version>/organizations/{location.organization_id}/projects/{location.project_id}
 * where `<version>` is a date-based version in the format YYYY-MM-DD.
 */
function truncateVaultSecretsOperationPath(path: string) {
	return path.replace(
		/\/secrets\/\d\d\d\d-\d\d-\d\d\/organizations\/\{location.organization_id\}\/projects\/\{location\.project_id\}/,
		''
	)
}

/**
 * Truncates HCP Packer API operation paths for clarity.
 * Intended to be used with a `<PathTruncationAside />` in each operation intro.
 *
 * This regex matches a standard prefix in HCP Packer API paths:
 * /packer/<version>/organizations/{location.organization_id}/projects/{location.project_id}
 * where `<version>` is a date-based version in the format YYYY-MM-DD.
 */
function truncatePackerOperationPath(path: string) {
	return path.replace(
		/\/packer\/\d\d\d\d-\d\d-\d\d\/organizations\/\{location.organization_id\}\/projects\/\{location\.project_id\}/,
		''
	)
}

/**
 * Render an aside warning that operation paths have been truncated,
 * and show the full path in a copy-able code block.
 */
function PathTruncationAside({ path }: { path: string }) {
	return (
		<>
			{/*
				@TODO replace DevDotContent & <div> with a base UI component
				https://app.asana.com/0/1202097197789424/1203820006759167/f
			*/}
			<DevDotContent>
				<div className="alert alert-info">
					<strong>Note:</strong> Operation paths have been truncated for
					clarity. The full path to this operation is below:
				</div>
			</DevDotContent>
			<CodeBlock code={path} theme="dark" options={{ showClipboard: true }} />
		</>
	)
}

export {
	PathTruncationAside,
	truncatePackerOperationPath,
	truncateVaultSecretsOperationPath,
}
