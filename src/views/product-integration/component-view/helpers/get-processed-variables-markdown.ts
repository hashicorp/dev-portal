/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReleaseComponent } from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'

type ProcessedVariableMarkdown = { description?: MDXRemoteSerializeResult }
export type ProcessedVariablesMarkdown = Record<
	string,
	ProcessedVariableMarkdown
>
/**
 * Given a release component,
 * which is expected to include `variable_groups`, each with `variables` which
 * are expected to have properties that need markdown processing,
 *
 * Return a map of unique `variable` keys to processed markdown for
 * each `variable`'s description. Processed markdown is stored as HTML.
 */
export async function getProcessedVariablesMarkdown(
	releaseComponent: ReleaseComponent
): Promise<ProcessedVariablesMarkdown> {
	const processedVariablesMarkdown: ProcessedVariablesMarkdown = {}
	const { variable_groups } = releaseComponent
	for (const variableGroup of variable_groups) {
		for (const variable of variableGroup.variables) {
			const { key, description, variable_group_id } = variable
			const uniqueKey = `${variable_group_id}.${key}`
			processedVariablesMarkdown[uniqueKey] = {}
			if (description !== null) {
				const { serializeResult: mdxSource } =
					await serializeIntegrationMarkdown(description)
				processedVariablesMarkdown[uniqueKey] = { description: mdxSource }
			}
		}
	}
	// Return the map of processed markdown
	return processedVariablesMarkdown
}
