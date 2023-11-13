import fs from 'fs'

// TODO create an alias for root dir
import { HVD_CONTENT_DIR } from '../../../scripts/extract-hvd-content'
import { ValidatedDesignsLandingProps } from '.'

/**
 * TODO reorganize data structure to return an array of
 * category groups to match ValidatedDesignsLandingProps
 */

export function getHvdLandingProps(): ValidatedDesignsLandingProps {
	// @TODO refactor to support all products based on Products type src/types/products.ts
	const hvdRepoContents = fs.readdirSync(HVD_CONTENT_DIR, {
		recursive: true,
		encoding: 'utf-8',
	})

	const files = []
	hvdRepoContents.forEach((path: string) => {
		if (path.endsWith('.mdx')) {
			const [product, category, hvdName, hvdSectionFile] = path.split('/')
			const hvdSectionPath = `/validated-designs/${product}-${category}-${hvdName}/${hvdSectionFile}`
			files.push({ path: hvdSectionPath })
		}
	})

	return {
		title: 'HashiCorp Validated Designs',
		description: 'TODO lorem ipsum the rain stay mainly in Spain.',
		_tmp: files,
	}
}
