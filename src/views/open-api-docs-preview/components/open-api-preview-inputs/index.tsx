import { useState } from 'react'
import classNames from 'classnames'
import { FileStringInput } from '../file-string-input'
import { TextInput } from '../text-input'
import s from './open-api-preview-inputs.module.css'
import { ObjectInput } from '../object-input'
import ArrayInput from '../array-input'
import { TextareaInput } from '../textarea-input'

const DEFAULT_INPUT_VALUES = {
	productSlug: 'hcp',
	openApiJsonString: '',
	openApiDescription: '',
	releaseStage: 'preview',
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl: 'https://status.hashicorp.com/api/v2/status.json',
	},
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library',
		},
		{
			title: 'Certifications',
			href: '/certifications',
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
				openApiDescription: inputData.openApiDescription,
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
			<div className={s.scrollableContent}>
				<div className={s.inputs}>
					<FileStringInput
						label="openApiJson"
						accept=".json"
						value={inputData.openApiJsonString}
						setValue={(v) => setInputValue('openApiJsonString', v)}
					/>
					<TextareaInput
						label="schema.info.description"
						value={inputData.openApiDescription}
						setValue={(v) => setInputValue('openApiDescription', v)}
					/>
					<TextInput
						label="productSlug"
						value={inputData.productSlug}
						setValue={(v) => setInputValue('productSlug', v)}
					/>
					{/* releaseStage can just be "preview", simplifies input */}
					{/* <TextInput
						label="releaseStage"
						value={inputData.releaseStage}
						setValue={(v) => setInputValue('releaseStage', v)}
					/> */}
					{/* statusIndicatorConfig can use top-level status page data */}
					{/* <ObjectInput
						label="statusIndicatorConfig"
						value={inputData.statusIndicatorConfig}
						setValue={(v) => setInputValue('statusIndicatorConfig', v)}
						properties={{
							pageUrl: { type: 'text' },
							endpointUrl: { type: 'text' },
						}}
					/> */}
					{/* navResourceItems can be generic, to simplify input */}
					{/* <ArrayInput
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
					/> */}
					<button
						className={s.generateButton}
						onClick={() => fetchStaticProps()}
					>
						Generate preview
					</button>
				</div>
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
