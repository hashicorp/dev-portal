import path from 'path'
import fetchNavDataForProducts from './helpers/fetch-nav-data-for-products'

const main = () => {
	fetchNavDataForProducts({
		generatedFilesFolderPath: path.join(__dirname, '.generated'),
	})
}

main()
