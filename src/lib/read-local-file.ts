/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'

/**
 * Read a local file from getStaticProps context,
 * using `process.cwd()` to resolve the provided filePath.
 *
 * Return the file contents as a string.
 */
export function readLocalFile(filePath: string): string {
	const fullPath = path.join(process.cwd(), filePath)
	return fs.readFileSync(fullPath, 'utf8')
}
