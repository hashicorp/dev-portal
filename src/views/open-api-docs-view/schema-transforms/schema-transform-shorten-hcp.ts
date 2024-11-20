/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { OpenAPIV3 } from 'openapi-types'
import { schemaTransformTitle } from './schema-transform-title'
import { shortenHcp } from '../utils/shorten-hcp'

/**
 * Given an OpenAPI schema document,
 * Return the document with the title modified, with any instances of
 * "HashiCorp Cloud Platform" replaced with "HCP".
 */
export function schemaTransformShortenHcp(
	schemaData: OpenAPIV3.Document
): OpenAPIV3.Document {
	return schemaTransformTitle(schemaData, shortenHcp)
}
