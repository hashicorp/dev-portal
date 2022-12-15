import yargs from 'yargs'
import path from 'path'
import fs from 'fs'

const addPrefixToFilePaths = ({
	prefix,
	filePaths,
}: {
	prefix: string
	filePaths: string[]
}) => {
	return filePaths.map((filePath: string) => path.join(prefix, filePath))
}

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
		'FILE_PATH_PREFIX',
		'RELEVANT_CHANGED_FILES',
		'REPO',
	].filter((key: string) => !process.env[key])
	if (missingRequiredEnvVariables.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missingRequiredEnvVariables}`
		)
	}

	// Pull needed environment variables
	const { FILE_PATH_PREFIX, REPO, RELEVANT_CHANGED_FILES } = process.env
	const relevantChangedFiles = JSON.parse(RELEVANT_CHANGED_FILES)

	// Return the shaped-up arguments
	return {
		changedMdxFiles: addPrefixToFilePaths({
			prefix: FILE_PATH_PREFIX,
			filePaths: relevantChangedFiles.changedMdxFiles ?? [],
		}),
		changedNavDataJsonFiles: addPrefixToFilePaths({
			prefix: FILE_PATH_PREFIX,
			filePaths: relevantChangedFiles.changedNavDataJsonFiles ?? [],
		}),
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
		.option('contentDirectory', {
			description: 'the directory where MDX files can be found',
		})
		.option('navDataDirectory', {
			description: 'the directory where nav data JSON files can be found',
		})
		.demandOption(['repo', 'contentDirectory', 'navDataDirectory'])
		.help().argv

	const contentDirectory = cliArgs.contentDirectory as string
	const navDataDirectory = cliArgs.navDataDirectory as string
	const repo = cliArgs.repo as string

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

	return { changedMdxFiles, changedNavDataJsonFiles, repo }
}

/**
 * Returns the arguments needed by `../rewrite-links.ts`, depending on whether
 * or not the current environment is CI.
 */
const getRewriteLinksScriptArguments = async (): Promise<{
	changedMdxFiles: string[]
	changedNavDataJsonFiles: string[]
	repo: string
}> => {
	return process.env.CI
		? getScriptArgumentsForCi()
		: getScriptArgumentsForCommandLine()
}

export { getRewriteLinksScriptArguments }
