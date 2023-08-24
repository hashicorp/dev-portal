// Third-party
import { useEffect, useState } from 'react'
import classNames from 'classnames'
// Components
import Button from 'components/button'
import InlineAlert from 'components/inline-alert'
// Inputs
import { FileStringInput } from '../file-string-input'
import { CodeMirrorInput } from '../code-mirror-input'
// Types
import type { OpenApiPageConfig } from 'views/open-api-docs-view/server'
import type { OpenApiDocsViewProps } from 'views/open-api-docs-view/types'
// Styles
import s from './open-api-preview-inputs.module.css'

/**
 * Boilerplate page configuration, we could in theory expose this so visitors
 * to the preview tool could manipulate it, but we intentionally just
 * hard-code here to keep the focus of the preview tool on OpenAPI spec
 * contents.
 */
const GENERIC_PAGE_CONFIG: Omit<OpenApiPageConfig, 'versionData'> = {
	// basePath same no matter what, preview tool is on static route
	basePath: '/openapi-docs-preview',
	// No versioning in the preview tool, focus on one spec file at a time
	context: { params: { page: [] } },
	// Hide the product context for now, preview tool focus is on spec content
	hideBackToProductLink: true,
	// Product slug, using HCP to just show a generic HashiCorp logo,
	// so that the preview tool's focus can remain on the spec file contents
	productSlug: 'hcp',
	// Generic resource items, we can set more specific ones closer to launch
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

export function OpenApiPreviewInputs({
	setStaticProps,
}: {
	setStaticProps: (v: OpenApiDocsViewProps) => void
}) {
	const [error, setError] = useState<{ title: string; description: string }>()
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [inputData, setInputData] = useState({
		openApiJsonString: '',
		openApiDescription: '',
	})

	/**
	 * Helper to set a specific input data value.
	 */
	function setInputValue(key: string, value: string) {
		setInputData((p) => ({ ...p, [key]: value }))
	}

	/**
	 * Pre-fill the description markdown from an input OpenAPI JSON string.
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
	 * Fetch static props for the page and update state when
	 * the provided `inputData` is submitted via a button activation.
	 */
	async function fetchStaticProps() {
		try {
			const result = await fetch('/api/get-openapi-view-props', {
				method: 'POST',
				body: JSON.stringify({
					...GENERIC_PAGE_CONFIG,
					openApiDescription: inputData.openApiDescription,
					openApiJsonString: inputData.openApiJsonString,
				}),
			})
			const resultData = await result.json()
			setStaticProps(resultData.props as OpenApiDocsViewProps)
		} catch (e) {
			setError({
				title: 'Failed to generate page data',
				description:
					'Failed to generate page data from the provided inputs. Please ensure the provided schema is valid JSON. Please also ensure the provided description is valid markdown.',
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
					{error ? (
						<InlineAlert
							color="critical"
							title={error.title}
							description={error.description}
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
