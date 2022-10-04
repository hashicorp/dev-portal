import fetchGithubFile from 'lib/fetch-github-file'
import fs from 'fs'
import path from 'path'

/**
 * Fetches a redirect file from a repository at the specified ref and saves it to the proxied-redirects folder.
 *
 * ```
 * $ npx hc-tools ./scripts/redirects/import-product-redirects.ts hashicorp/waypoint/website/redirects.js#stable-website www.waypointproject.io
 * ```
 */
export default async function main() {
	const [, , repoFilePathAndRef, domain] = process.argv

	console.log(repoFilePathAndRef, domain)

	const [repoFilePath, ref] = repoFilePathAndRef.split('#')
	const [owner, repo, ...pathParts] = repoFilePath.split('/')
	const filePath = pathParts.join('/')

	let file

	try {
		file = await fetchGithubFile({
			owner,
			repo,
			path: filePath,
			ref: ref ?? 'stable-website',
		})
	} catch (err) {
		console.log('❌ failed to fetch file at:', repoFilePathAndRef)
		return
	}

	validateRedirectFile(file)
	console.log('✅ redirect file format validated')

	const targetPath = path.join(
		process.cwd(),
		'proxied-redirects',
		`${domain}.redirects.js`
	)

	console.log(`📝 writing redirect file to: ${targetPath}`)

	await fs.promises.writeFile(targetPath, file, { encoding: 'utf-8' })
}

main()

/**
 * The redirect file is a module, so we want to parse it, extract the exports, and validate we get back an array
 */
function validateRedirectFile(blob) {
	const mod: NodeModule = {
		isPreloading: false,
		exports: undefined,
		require: undefined,
		id: '',
		filename: '',
		loaded: false,
		parent: undefined,
		children: [],
		path: '',
		paths: [],
	}

	const fn = new Function('module', blob)
	fn(mod)

	const redirects = mod.exports

	// validate that the js file exports an array
	if (!Array.isArray(redirects)) {
		throw new Error(
			'Redirect validation failed, expected an array, but got:',
			redirects
		)
	}
}
