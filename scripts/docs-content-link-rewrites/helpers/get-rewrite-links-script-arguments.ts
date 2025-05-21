/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import yargs from 'yargs'
import path from 'path'
import fs from 'fs'
import { getMdxAndNavDataDirectoriesForRepo } from './get-mdx-and-nav-data-directories-for-repo'

const gatherAllFilesWithSuffixFromDirectory = ({
	directory,
	fileSuffix,
	allFiles = [],
}: {
	directory: string
	fileSuffix: string
	allFiles: string[]
}) => {
	fs.readdirSync(directory).forEach((item: string) => {
		const itemPath = path.join(directory, item)
		if (fs.lstatSync(itemPath).isDirectory()) {
			gatherAllFilesWithSuffixFromDirectory({
				directory: itemPath,
				fileSuffix,
				allFiles,
			})
		} else if (item.endsWith(fileSuffix)) {
			allFiles.push(itemPath)
		}
	})
}

const getScriptArgumentsForCi = () => {
	// Make sure the required environment variables are set
	const missingRequiredEnvVariables = [
		'MDX_FILE_PATH_PREFIX',
		'NAV_DATA_FILE_PATH_PREFIX',
		'RELEVANT_CHANGED_FILES',
		'REPO',
	].filter((key: string) => !process.env[key])
	if (missingRequiredEnvVariables.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missingRequiredEnvVariables}`
		)
	}

	// Pull needed environment variables
	const {
		MDX_FILE_PATH_PREFIX,
		NAV_DATA_FILE_PATH_PREFIX,
		REPO,
		RELEVANT_CHANGED_FILES,
	} = process.env
	const { changedMdxFiles = [], changedNavDataJsonFiles = [] } = JSON.parse(
		RELEVANT_CHANGED_FILES
	)

	// Concatenate cwd() with given file path prefixes
	const mdxFilesPrefix = path.join(process.cwd(), MDX_FILE_PATH_PREFIX)
	const navDataFilesPrefix = path.join(process.cwd(), NAV_DATA_FILE_PATH_PREFIX)

	// Return the shaped-up arguments
	return {
		changedMdxFiles: changedMdxFiles.map((filePath) =>
			path.join(mdxFilesPrefix, filePath)
		),
		changedNavDataJsonFiles: changedNavDataJsonFiles.map((filePath) =>
			path.join(navDataFilesPrefix, filePath)
		),
		mdxFilesPrefix,
		navDataFilesPrefix,
		repo: REPO,
	}
}

const getScriptArgumentsForCommandLine = () => {
	const changedMdxFiles = []
	const changedNavDataJsonFiles = []

	const cliArgs = yargs
		.option('repo', {
			description: 'the name of the repo under `hashicorp` to check',
		})
		.option('localCopyLocation', {
			description:
				'where your local copy of --repo is, relative to the present working directory (pwd)',
		})
		.demandOption(['repo', 'localCopyLocation'])
		.help().argv

	// $TSFixMe
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const repo = cliArgs.repo as string
	// $TSFixMe
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const localCopyLocation = cliArgs.localCopyLocation as string
	const { mdxPrefix, navDataPrefix } = getMdxAndNavDataDirectoriesForRepo(repo)
	const contentDirectory = path.join(
		process.cwd(),
		localCopyLocation,
		repo,
		mdxPrefix
	)
	const navDataDirectory = path.join(
		process.cwd(),
		localCopyLocation,
		repo,
		navDataPrefix
	)

	gatherAllFilesWithSuffixFromDirectory({
		directory: contentDirectory,
		fileSuffix: '.mdx',
		allFiles: changedMdxFiles,
	})
	gatherAllFilesWithSuffixFromDirectory({
		directory: navDataDirectory,
		fileSuffix: '-nav-data.json',
		allFiles: changedNavDataJsonFiles,
	})

	return {
		changedMdxFiles,
		changedNavDataJsonFiles,
		mdxFilesPrefix: contentDirectory,
		navDataFilesPrefix: navDataDirectory,
		repo,
	}
}

/**
 * Returns the arguments needed by `../rewrite-links.ts`, depending on whether
 * or not the current environment is CI.
 */
const getRewriteLinksScriptArguments = async (): Promise<{
	changedMdxFiles: string[]
	changedNavDataJsonFiles: string[]
	mdxFilesPrefix: string
	navDataFilesPrefix: string
	repo: string
}> => {
	return process.env.CI
		? getScriptArgumentsForCi()
		: getScriptArgumentsForCommandLine()
}

export { getRewriteLinksScriptArguments }
