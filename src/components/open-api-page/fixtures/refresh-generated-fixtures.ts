import fs from 'fs'
import packerRawSwagger from './raw-schemas/packer.swagger.json'
import boundaryRawSwagger from './raw-schemas/boundary.swagger.json'
import { processSchema } from '../server/process-schema'
import { getPropsForPage } from '../server'

main()

/**
 * This is a dev-targeted utility function for
 * generating processed fixtures that are easy to import into Swingset.
 */
async function main() {
	if (!fs.existsSync('./fixtures/generated')) {
		fs.mkdirSync('./fixtures/generated')
	}
	// Generate de-referenced Boundary swagger file
	const boundarySwagger = await processSchema(boundaryRawSwagger)
	fs.writeFileSync(
		'./fixtures/generated/boundary.swagger.json',
		JSON.stringify(boundarySwagger, null, 2)
	)
	const boundaryPageProps = getPropsForPage(boundarySwagger, {
		page: ['account-service'],
	})
	fs.writeFileSync(
		'./fixtures/generated/boundary-page-props.json',
		JSON.stringify(boundaryPageProps, null, 2)
	)
	// Generate de-referenced Packer swagger file
	const packerSwagger = await processSchema(packerRawSwagger)
	fs.writeFileSync(
		'./fixtures/generated/packer.swagger.json',
		JSON.stringify(packerSwagger, null, 2)
	)
	const packerPageProps = getPropsForPage(packerSwagger, {
		page: [],
	})
	fs.writeFileSync(
		'./fixtures/generated/packer-page-props.json',
		JSON.stringify(packerPageProps, null, 2)
	)
}
