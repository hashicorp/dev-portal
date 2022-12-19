import getDocsBreadcrumbs, {
	getPathBreadcrumbs,
} from '../utils/get-docs-breadcrumbs'
import waypointData from 'data/waypoint.json'
import terraformData from 'data/terraform.json'
import waypointNavData from '../__fixtures__/waypoint-nav-data.json'
import terraformPluginSDKv2NavData from '../__fixtures__/terraform-plugin-sdkv2-nav-data.json'
import { ProductData } from 'types/products'
import { NavData } from '@hashicorp/react-docs-sidenav/types'

describe('getDocsBreadcrumbs', () => {
	it('prepends docs breadcrumbs for a basic example', () => {
		const args = {
			basePath: 'docs',
			baseName: 'Docs',
			product: waypointData as ProductData,
			pathParts: ['getting-started'],
			navData: waypointNavData as NavData,
		}
		const expected = [
			{
				title: 'Developer',
				url: '/',
			},
			{
				title: 'Waypoint',
				url: '/waypoint',
			},
			{
				title: 'Docs',
				url: '/waypoint/docs',
				isCurrentPage: false,
			},
			{
				title: 'Getting Started',
				url: '/waypoint/docs/getting-started',
				isCurrentPage: true,
			},
		]
		expect(getDocsBreadcrumbs(args)).toEqual(expected)
	})

	it('prepends docs breadcrumbs for a nested rootDocsPath', () => {
		const args = {
			basePath: 'plugin/sdkv2',
			baseName: 'SDKv2',
			product: terraformData as ProductData,
			pathParts: ['debugging'],
			navData: terraformPluginSDKv2NavData,
		}
		const expected = [
			{
				title: 'Developer',
				url: '/',
			},
			{
				title: 'Terraform',
				url: '/terraform',
			},
			{
				title: 'Plugin Development',
				url: '/terraform/plugin',
			},
			{
				title: 'SDKv2',
				url: '/terraform/plugin/sdkv2',
				isCurrentPage: false,
			},
			{
				title: 'Debugging Providers',
				url: '/terraform/plugin/sdkv2/debugging',
				isCurrentPage: true,
			},
		]
		expect(getDocsBreadcrumbs(args)).toEqual(expected)
	})
})

describe('getPathBreadcrumbs', () => {
	it('returns links for a basic example', () => {
		const args = {
			basePath: 'docs',
			pathParts: ['getting-started'],
			navData: waypointNavData as NavData,
		}
		const expected = [
			{
				title: 'Getting Started',
				url: '/docs/getting-started',
				isCurrentPage: true,
			},
		]
		expect(getPathBreadcrumbs(args)).toEqual(expected)
	})

	it('returns links for overview paths using the title of the parent category', () => {
		const args = {
			basePath: 'docs',
			pathParts: ['intro', 'vs'],
			navData: waypointNavData as NavData,
		}
		const expected = [
			{
				title: 'Introduction',
				url: '/docs/intro',
			},
			{
				title: 'Waypoint vs. Other Software',
				url: '/docs/intro/vs',
				isCurrentPage: true,
			},
		]
		expect(getPathBreadcrumbs(args)).toEqual(expected)
	})

	it('skips index-less categories in breadcrumb paths', () => {
		const args = {
			basePath: 'docs',
			pathParts: ['kubernetes', 'install'],
			navData: waypointNavData as NavData,
		}
		const expected = [
			{
				title: 'Kubernetes',
			},
			{
				title: 'Install',
				url: '/docs/kubernetes/install',
				isCurrentPage: true,
			},
		]
		expect(getPathBreadcrumbs(args)).toEqual(expected)
	})
})
