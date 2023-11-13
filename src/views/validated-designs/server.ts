import path from 'path'
import fs from 'fs'

// TODO create an alias for root dir
import { HVD_CONTENT_DIR } from '../../../scripts/extract-hvd-content'
import { ValidatedDesignsLandingProps } from '.'
import { isProductSlug, products } from 'lib/products'

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

// TODO this should return `ValidatedDesignsLandingProps`
export function getHvdLandingProps() {
	// @TODO refactor to support all products based on Products type src/types/products.ts
	const hvdRepoContents = fs.readdirSync(HVD_CONTENT_DIR, { recursive: true })
	const mdxFiles = []
	hvdRepoContents.forEach((item) => {
		const itemPath = path.join(HVD_CONTENT_DIR, item)
		if (fs.lstatSync(itemPath).isDirectory() && isProductSlug(item)) {
			gatherAllFilesWithSuffixFromDirectory({
				directory: itemPath,
				fileSuffix: '.mdx',
				allFiles: mdxFiles,
			})
		}
	})

	return mdxFiles
}
