import path from 'path'
import fs from 'fs'

// TODO create an alias for root dir
import { HVD_CONTENT_DIR } from '../../../scripts/extract-hvd-content'
const tmp_HVD_CONTENT_DIR_TF = `${HVD_CONTENT_DIR}/hvd-docs/terraform`

export function getHvdLandingProps() {
	// @TODO refactor to support all products based on Products type src/types/products.ts
	const terraformHvdDir = fs.readdirSync(tmp_HVD_CONTENT_DIR_TF, {
		recursive: true,
	})
	console.log({ terraformHvdDir })
	const files = []
	terraformHvdDir.map((_path) => {
		if (_path.endsWith('.mdx')) {
			const fileData = fs.readFileSync(
				path.join(tmp_HVD_CONTENT_DIR_TF, _path),
				{ encoding: 'utf-8' }
			)
			// @TODO swap with the product dir
			const product = 'terraform'
			const [category, hvdName, hvdSectionFile] = _path.split('/')
			const hvdSectionPath = `/validated-designs/${product}-${category}-${hvdName}/${hvdSectionFile}`
			files.push({ path: hvdSectionPath, data: JSON.stringify(fileData) })
		}
	})

	return files
}
