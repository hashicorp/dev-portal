/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import { validateNavData } from './validate-nav-data'

export async function resolveNavData(
	filePath: string,
	localContentDir: string
) {
	const navDataFile = path.join(process.cwd(), filePath)
	const navDataRaw = JSON.parse(fs.readFileSync(navDataFile, 'utf8'))
	const withFilePaths = await validateNavData(navDataRaw, localContentDir)
	return withFilePaths
}
