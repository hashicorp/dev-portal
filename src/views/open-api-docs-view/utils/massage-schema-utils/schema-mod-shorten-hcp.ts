/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { OpenAPIV3 } from 'openapi-types'
import { schemaModTitle } from './schema-mod-title'

/**
 * Replaces "HashiCorp Cloud Platform" with "HCP" in the given string.
 */
function shortenHcp(s: string): string {
	return s.replace('HashiCorp Cloud Platform', 'HCP')
}

/**
 * Given an OpenAPI schema document,
 * Return the document with the title modified, with any instances of
 * "HashiCorp Cloud Platform" replaced with "HCP".
 */
export function schemaModShortenHcp(
	schemaData: OpenAPIV3.Document
): OpenAPIV3.Document {
	return schemaModTitle(schemaData, shortenHcp)
}
