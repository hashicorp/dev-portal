import path from 'path'
import fetchVersionsForProducts from './helpers/fetch-versions-for-products'

const main = () => {
	fetchVersionsForProducts({
		generatedFilesFolderPath: path.join(__dirname, '.generated'),
	})
}

main()
