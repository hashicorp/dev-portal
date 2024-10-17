/** eslint-ignore-next-line: fix this, seems related to TypeScript */
function checkIsMigratedToUnifiedDocs(repoName: string) {
	const migratedRepos = __config.flags.unified_docs_migrated_repos
	return migratedRepos.indexOf(repoName) !== -1
}

export default checkIsMigratedToUnifiedDocs
