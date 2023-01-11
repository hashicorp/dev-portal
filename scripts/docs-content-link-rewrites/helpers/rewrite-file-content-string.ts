import { escapeRegExp } from 'lib/get-escaped-reg-exp'

/**
 * Returns a copy of the given `rawContent` string and rewrites strings in it
 * based on the keys in the `pathsToRewrite` map.
 *
 * Originally from:
 * https://github.com/hashicorp/learn-redirect-service/blob/main/lib/_tmp/rewrite-file-content-string.js
 */
export const rewriteFileContentString = (rawContent, pathsToRewrite) => {
	// Make a copy of the given `rawContent` string
	let newFileContents = rawContent.slice()

	// Get an reverse alphabetical order list of keys in `pathsToRewrite`
	const oldPaths = Object.keys(pathsToRewrite).sort().reverse()

	// For each path to rewrite...
	oldPaths.forEach((oldPath) => {
		// Get the new path associated with the old path
		const newPath = pathsToRewrite[oldPath]

		/**
		 * Replace all inline link instances of the old path with the new path
		 */
		const inlineLinkRegex = new RegExp(escapeRegExp(`](${oldPath})`), 'g')
		if (newFileContents.match(inlineLinkRegex)) {
			newFileContents = newFileContents.replaceAll(
				inlineLinkRegex,
				`](${newPath})`
			)
		}

		/**
		 * Replace all definition instances of the old path with the new path.
		 *
		 * There are two regexes used here:
		 *
		 * 	- `definitionMatchRegex` is used to find an instance of a defintion,
		 * 		which can only end with a whitespace character. The `(?!\\S)` portion
		 * 		of the regex says "does not end with a non-whitespace character".
		 * 	- `definitionReplaceAllRegex` is used as the first argument for
		 * 		`replaceAll` so that the character that comes after the definition is
		 * 		not removed.
		 */
		const basicRegexString = `\\]: ${escapeRegExp(oldPath)}`
		const definitionMatchRegex = new RegExp(`${basicRegexString}(?!\\S)`)
		const definitionReplaceAllRegex = new RegExp(basicRegexString, 'g')
		if (newFileContents.match(definitionMatchRegex)) {
			newFileContents = newFileContents.replaceAll(
				definitionReplaceAllRegex,
				`]: ${newPath}`
			)
		}
	})

	// Return the modified content string
	return newFileContents
}
