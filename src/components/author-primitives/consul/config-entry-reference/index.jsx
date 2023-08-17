/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Tabs, { Tab } from 'components/tabs'
import EnterpriseAlertBase from '@hashicorp/react-enterprise-alert'
import { MdxListItem } from 'components/dev-dot-content/mdx-components'
import { VariableGroupList } from '../variable-group-list'

/**
 * ConfigEntryReference renders the reference docs for a config entry.
 * It creates two tabs, one for HCL docs and one for Kubernetes docs.
 *
 * @param {array<object>} keys  Array of objects, that describe all
 *                              keys that can be set for this config entry.
 * @param {boolean} topLevel    Indicates this is a reference block that contains
 *                              the top level keys vs a reference block that documents
 *                              nested keys and that is separated out for clarity.
 *
 * The objects in the keys array support the following keys:
 * - name <required>: the name of the HCL key, e.g. Name, Listener. This case sensitive.
 * - description <required>: the description of the key. If this key has different descriptions
 * for HCL vs. Kube YAML then description can be an object:
 * description: {
 *       hcl: 'HCL description',
 *       yaml: 'YAML description'
 *     }
 * - hcl <optional>: a boolean to indicate if this key should be shown in the HCL
 * documentation. Defaults to true.
 * - yaml <optional>: a boolean to indicate if this key should be shown in the YAML
 * documentation. Defaults to true.
 * - enterprise <optional>: a boolean to indicate if this key is Consul Enterprise
 * only. Defaults to false.
 * - children <optional>: accepts an array of keys that must be set under this key.
 * The schema for these keys is the same as the top level keys.
 * - type <optional>: the type and default of this key, e.g. string: "default".
 */
export default function ConfigEntryReference({ keys, topLevel = true }) {
	// Kube needs to have its non-top-level keys nested under a "spec" key.
	const kubeKeys = topLevel ? toKubeKeys(keys) : keys
	return (
		<Tabs>
			<Tab heading="HCL" group="hcl">
				{renderKeys(keys, true)}
			</Tab>
			<Tab heading="Kubernetes YAML" group="yaml">
				{renderKeys(kubeKeys, false)}
			</Tab>
		</Tabs>
	)
}

/**
 * Renders keys as HTML. It works recursively through all keys.
 * @param {array} keys
 * @param {boolean} isHCLTab
 * @returns {JSX.Element|null}
 */
function renderKeys(keys, isHCLTab) {
	if (!keys) {
		return null
	}
	return <>{keys.map((key) => renderKey(key, isHCLTab))}</>
}

/**
 * Renders a single key as its HTML element.
 *
 * @param {object} key
 * @param {boolean} isHCLTab
 * @returns {JSX.Element|null}
 */
function renderKey(key, isHCLTab) {
	if (!key.name) {
		return null
	}
	if (isHCLTab && key.hcl === false) {
		return null
	}
	if (!isHCLTab && key.yaml === false) {
		return null
	}

	const variableGroup = {
		name: 'Parameters',
		children: [
			{
				name: key.name,
				type: key.type,
				description: key.description,
				isHCLTab: isHCLTab,
				required: key.required,
				enterprise: key.enterprise,
				default_value: key.default_value,
				children: key.children,
			},
		],
	}

	return (
		<>
			<VariableGroupList
				key={key.name}
				groupName={variableGroup.name}
				children={variableGroup.children}
			/>
			{/* <MdxListItem key={keyLower}>
				<a id={keyLower} className="__target-lic" aria-hidden="" />
				<p>
					<a
						href={'#' + keyLower}
						aria-label={keyLower + ' permalink'}
						className="__permalink-lic"
					>
						<code>{keyName}</code>
					</a>{' '}
					{type}
					{enterpriseAlert}
					<span dangerouslySetInnerHTML={{ __html: htmlDescription }} />
				</p>
				{renderKeys(key.children, isHCLTab)}
			</MdxListItem> */}
		</>
	)
}

/**
 * Constructs a keys object for Kubernetes out of HCL keys.
 * Really all this entails is nesting the correct keys under the Kubernetes
 * 'spec' key since in HCL there is no 'spec' key.
 *
 * @param {array} keys
 * @returns {array}
 */
function toKubeKeys(keys) {
	const topLevelKeys = keys.filter((key) => isTopLevelKubeKey(key.name))
	const keysUnderSpec = keys.filter((key) => !isTopLevelKubeKey(key.name))
	return topLevelKeys.concat([{ name: 'spec', children: keysUnderSpec }])
}

/**
 * Returns true if key is a key used at the top level of a CRD. By top level we
 * mean not nested under any other key.
 *
 * @param {string} name name of the key
 *
 * @return {boolean}
 */
function isTopLevelKubeKey(name) {
	return (
		name.toLowerCase() === 'metadata' ||
		name.toLowerCase() === 'kind' ||
		name.toLowerCase() === 'apiversion'
	)
}