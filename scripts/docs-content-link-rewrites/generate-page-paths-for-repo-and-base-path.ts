import fs from 'fs'
import { getAllPagePaths } from '../../src/lib/get-all-page-paths'
import { ALL_PAGE_PATHS_OUTPUT_FILE_PATH } from './constants'

const main = async () => {
	const { BASE_PATH, BRANCH_NAME, REPO_NAME } = process.env

	if (!BASE_PATH) {
		throw new Error('The BASE_PATH environment variable is required')
	}

	if (!REPO_NAME) {
		throw new Error('The REPO_NAME environment variable is required')
	}

	const allPagePaths = await getAllPagePaths({
		basePath: BASE_PATH,
		branchName: BRANCH_NAME,
		repoName: REPO_NAME,
	})

	fs.writeFileSync(
		ALL_PAGE_PATHS_OUTPUT_FILE_PATH,
		JSON.stringify(allPagePaths)
	)
}

main()
