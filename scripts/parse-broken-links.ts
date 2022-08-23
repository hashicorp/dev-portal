import path from 'path'
import fs from 'fs'
import { VERSION_IN_PATH_REGEX } from 'constants/version-path'

async function main() {
	const reportPath = path.join(process.cwd(), 'broken_links.json')
	const rawReport = fs.readFileSync(reportPath, { encoding: 'utf-8' })

	const report = JSON.parse(rawReport)

	for (const page of report) {
		if (page.url.match(VERSION_IN_PATH_REGEX)) {
			continue
		}

		const lines = []

		for (const link of page.links) {
			if (link.error !== '404' || link.url.match(VERSION_IN_PATH_REGEX)) {
				continue
			}
			lines.push(['  -', link.error, link.url, '\n'].join(' '))
		}

		if (lines.length > 0) {
			console.log(page.url)
			console.log(...lines)
		}
	}
}

main()
