import { useState } from 'react'
import classNames from 'classnames'
import { FileStringInput } from '../file-string-input'
import { TextInput } from '../text-input'
import s from './open-api-preview-inputs.module.css'
import { ObjectInput } from '../object-input'
import ArrayInput from '../array-input'

const DEFAULT_INPUT_VALUES = {
	productSlug: 'hcp',
	openApiJsonString: '',
	releaseStage: 'preview',
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/sxffkgfb4fhb.json',
	},
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library?product=consul&edition=hcp',
		},
		{
			title: 'Certifications',
			href: '/certifications/networking-automation',
		},
		{
			title: 'Community',
			href: 'https://discuss.hashicorp.com/',
		},
		{
			title: 'Support',
			href: 'https://www.hashicorp.com/customer-success',
		},
	],
}

/**
 * TODO: write description
 */
function fakeVersionDataFromSourceFile(
	openApiJsonString: string,
	releaseStage: string = 'preview'
) {
	return [
		{
			versionId: 'preview-version-this-string-shouldnt-matter',
			releaseStage,
			sourceFile: openApiJsonString,
		},
	]
}

export function OpenApiPreviewInputs({ setStaticProps }: $TSFixMe) {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [inputData, setInputData] = useState(DEFAULT_INPUT_VALUES)

	function setInputValue(key: string, value: string) {
		setInputData((p) => ({ ...p, [key]: value }))
	}

	async function fetchStaticProps() {
		console.log('fetching static props...')
		const versionData = fakeVersionDataFromSourceFile(
			inputData.openApiJsonString,
			inputData.releaseStage
		)
		const result = await fetch('/api/get-openapi-view-props', {
			method: 'POST',
			body: JSON.stringify({
				// basePath same no matter what, I think, preview tool is on static route
				basePath: '/openapi-docs-preview',
				// context is the same no matter what, no versioning, static route
				context: { params: { page: [] } },
				productSlug: inputData.productSlug,
				statusIndicatorConfig: inputData.statusIndicatorConfig,
				navResourceItems: inputData.navResourceItems,
				versionData,
			}),
		})
		const resultData = await result.json()
		setStaticProps(resultData)
	}

	return (
		<div className={classNames(s.root, { [s.isCollapsed]: isCollapsed })}>
			<div className={s.inputs}>
				<FileStringInput
					label="openApiJson"
					accept=".json"
					value={inputData.openApiJsonString}
					setValue={(v) => setInputValue('openApiJsonString', v)}
				/>
				<TextInput
					label="productSlug"
					value={inputData.productSlug}
					setValue={(v) => setInputValue('productSlug', v)}
				/>
				<TextInput
					label="releaseStage (optional)"
					value={inputData.releaseStage}
					setValue={(v) => setInputValue('releaseStage', v)}
				/>
				<ObjectInput
					label="statusIndicatorConfig"
					value={inputData.statusIndicatorConfig}
					setValue={(v) => setInputValue('statusIndicatorConfig', v)}
					properties={{
						pageUrl: { type: 'text' },
						endpointUrl: { type: 'text' },
					}}
				/>
				<ArrayInput
					label="navResourceItems"
					value={inputData.navResourceItems}
					setValue={(v) => setInputValue('navResourceItems', v)}
					arrayOf={{
						label: 'navResourceItem',
						type: 'object',
						properties: {
							title: { type: 'text' },
							href: { type: 'text' },
						},
					}}
				/>
				<button className={s.generateButton} onClick={() => fetchStaticProps()}>
					Generate preview
				</button>
				<div className={s.collapseButtonLayout}>
					<button
						className={s.collapseButton}
						onClick={() => setIsCollapsed((p) => !p)}
					>
						{isCollapsed ? 'Show' : 'Hide'} preview inputs
					</button>
				</div>
			</div>
		</div>
	)
}
