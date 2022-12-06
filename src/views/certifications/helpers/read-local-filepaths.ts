import fs from 'fs'
import path from 'path'

/**
 * Read the filepaths in a local folder in getStaticProps context,
 * using `process.cwd()` to resolve the provided folderPath.
 *
 * Return the file paths present in the folder as an array of strings.
 */
export function readLocalFilepaths(folderPath: string): string[] {
	const fullPath = path.join(process.cwd(), folderPath)
	return fs.readdirSync(fullPath)
}
