/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { execFileSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { DeveloperPreviewBuilder } from './builders/developer'

/**
 * Controls how the application is built, using either the `IoPreviewBuilder` or `DeveloperPreviewBuilder`
 */
type PreviewMode = 'io' | 'developer'

// our CWD
const cwd = process.cwd()

function checkEnvVars() {
	// Filter out defined env vars, leaving only the missing ones
	const missingEnvVars = ['REPO'].filter((key) => !process.env[key])

	if (missingEnvVars.length > 0) {
		console.error(
			`Missing required environment variables: ${missingEnvVars.join(
				', '
			)}. Ensure they're defined in .env or in the Vercel project`
		)
		return false
	}

	return true
}

async function main() {
	if (!checkEnvVars()) {
		process.exit(1)
	}

	process.env.IS_CONTENT_PREVIEW = 'true'

	const previewMode: PreviewMode =
		(process.env.PREVIEW_MODE as PreviewMode | undefined) || 'io'

	const repo = process.env.REPO

	const builder = DeveloperPreviewBuilder(repo)

	console.log(`🏗 building deploy preview with mode: ${previewMode}`)

	/**
	 * Check for a cached node_modules folder folder, if found copy it back into our website-preview dir
	 * This should allow us to take advantage of Vercel's build cache
	 */
	if (fs.existsSync(path.join(cwd, '.next', 'cache', 'node_modules'))) {
		console.log('Found cached node_modules, moving...')
		execFileSync('mv', ['./.next/cache/node_modules', './node_modules'])
	}

	/**
	 * Copy public files
	 *
	 * Vercel uploads the public/ directory from the root directory of the project, so we want to pull
	 * the public files from website-preview up a level.
	 */
	console.log('📝 copying files in the public folder')
	execFileSync('cp', ['-R', './public', `../`])

	/**
	 * Execute any prebuild steps from the builder
	 */
	console.log('⚙️ executing prebuild step')
	await builder.prebuild()

	/** Install deps */
	console.log('📦 Installing dependencies')
	execFileSync('npm', ['install', '--production=false'], { stdio: 'inherit' })

	/** Build */
	await builder.build()

	// Put node_modules into .next/cache so we can retrieve them on subsequent builds
	execFileSync('cp', ['-R', 'node_modules', '.next/cache'], {
		stdio: 'inherit',
	})
}

main()
