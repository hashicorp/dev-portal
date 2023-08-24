import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { FileStringInput } from '../file-string-input'
import s from './open-api-preview-inputs.module.css'
import { CodeMirrorInput } from '../code-mirror-input'
import Button from 'components/button'
import InlineAlert from 'components/inline-alert'

const GENERIC_PAGE_CONFIG = {
	// basePath same no matter what, I think, preview tool is on static route
	basePath: '/openapi-docs-preview',
	// context is the same no matter what, no versioning, static route
	context: { params: { page: [] } },
	hideBackToProductLink: true,
	productSlug: 'hcp',
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

const DEFAULT_VALUES = {
	openApiJsonString: '',
	openApiDescription: '',
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

export function OpenApiPreviewInputs({
	staticProps,
	setStaticProps,
}: $TSFixMe) {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [inputData, setInputData] = useState(DEFAULT_VALUES)

	function setInputValue(key: string, value: string) {
		setInputData((p) => ({ ...p, [key]: value }))
	}

	/**
	 * When the inputData.openApiJsonString value changes, in a try-catch,
	 * attempt to parse the JSON `schema` from the string, grab the
	 * `schema.info.description`, and set `inputData.openApiDescription`
	 * based on that value.
	 */
	useEffect(() => {
		if (inputData.openApiDescription !== '') {
			return
		}
		try {
			const parsed = JSON.parse(inputData.openApiJsonString)
			const parsedValue = parsed?.info?.description
			if (parsedValue && inputData.openApiDescription !== parsedValue) {
				setInputValue('openApiDescription', parsedValue)
			}
		} catch (e) {
			// do nothing
		}
	}, [inputData.openApiJsonString, inputData.openApiDescription])

	/**
	 * TODO: add description
	 */
	async function fetchStaticProps() {
		console.log('fetching static props...')
		const versionData = fakeVersionDataFromSourceFile(
			inputData.openApiJsonString,
			GENERIC_PAGE_CONFIG.releaseStage
		)
		try {
			const result = await fetch('/api/get-openapi-view-props', {
				method: 'POST',
				body: JSON.stringify({
					...GENERIC_PAGE_CONFIG,
					openApiDescription: inputData.openApiDescription,
					versionData,
				}),
			})
			const resultData = await result.json()
			setStaticProps(resultData)
		} catch (e) {
			setStaticProps({
				error: {
					title: 'Failed to generate page data',
					description:
						'Failed to generate page data from the provided inputs. Please ensure the provided schema is valid JSON. Please also ensure the provided description is valid markdown.',
				},
			})
		}
	}

	return (
		<div className={classNames(s.root, { [s.isCollapsed]: isCollapsed })}>
			<div className={s.scrollableContent}>
				<div className={s.inputs}>
					<div className={s.topRow}>
						<FileStringInput
							label="OpenAPI File"
							accept=".json"
							value={inputData.openApiJsonString}
							setValue={(v) => setInputValue('openApiJsonString', v)}
						/>
						<Button
							className={s.generateButton}
							text="Generate preview"
							size="large"
							color="secondary"
							onClick={() => fetchStaticProps()}
						/>
					</div>
					{staticProps && 'error' in staticProps ? (
						<InlineAlert
							color="critical"
							title={staticProps.error.title}
							description={staticProps.error.description}
						/>
					) : null}
					<div className="hds-form-field--layout-vertical">
						<label className="hds-form-label hds-form-field__label hds-typography-body-200 hds-font-weight-semibold">
							Schema Source
						</label>
						<div className="hds-form-field__control">
							<CodeMirrorInput
								language="json"
								value={inputData.openApiJsonString}
								setValue={(v) => setInputValue('openApiJsonString', v)}
							/>
						</div>
					</div>
					<div className="hds-form-field--layout-vertical">
						<label className="hds-form-label hds-form-field__label hds-typography-body-200 hds-font-weight-semibold">
							Description Markdown
						</label>
						<div className="hds-form-field__control">
							<CodeMirrorInput
								language="markdown"
								value={inputData.openApiDescription}
								setValue={(v) => setInputValue('openApiDescription', v)}
							/>
						</div>
					</div>
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
