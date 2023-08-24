import { useState } from 'react'
import { FileStringInput } from '../file-string-input'
import { TextInput } from '../text-input'
import s from './open-api-preview-inputs.module.css'
import classNames from 'classnames'
import KnobsForm from '../knobs-form'
import { ObjectInput } from '../object-input'

const BASE_INPUT_DATA = {
	// basePath same no matter what, I think, preview tool is on static route
	basePath: '/openapi-docs-preview',
	// context is the same no matter what, no versioning, static route
	context: { params: { page: [] } },
	/**
	 * navResourceItems should be controllable, optional.
	 * TODO: allow control via inputs
	 */
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library?product=vault&edition=hcp',
		},
		{
			title: 'Certifications',
			href: '/certifications/security-automation',
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
	const [inputData, setInputData] = useState({
		productSlug: 'hcp',
		openApiJsonString: '',
		releaseStage: 'preview',
		statusIndicatorConfig: {
			pageUrl: 'https://status.hashicorp.com',
			endpointUrl:
				'https://status.hashicorp.com/api/v2/components/sxffkgfb4fhb.json',
		},
	})

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
				...BASE_INPUT_DATA,
				productSlug: inputData.productSlug,
				statusIndicatorConfig: inputData.statusIndicatorConfig,
				versionData,
			}),
		})
		const resultData = await result.json()
		setStaticProps(resultData)
	}

	return (
		<div className={classNames(s.root, { [s.isCollapsed]: isCollapsed })}>
			<div className={s.inputs}>
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
				<FileStringInput
					label="openApiJson"
					accept=".json"
					value={inputData.openApiJsonString}
					setValue={(v) => setInputValue('openApiJsonString', v)}
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
				<button onClick={() => fetchStaticProps()}>Generate preview</button>
				<p>
					TODO: lots more inputs to add, still lots of HCP Vault Secrets
					placeholder here.
				</p>
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
