/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { useEffect, useState } from 'react'
import classNames from 'classnames'
// Components
import Button from 'components/button'
import InlineAlert from 'components/inline-alert'
import { CheckboxField } from 'components/form/field-controls'
// Inputs
import { FileStringInput } from '../file-string-input'
import { TextareaInput } from '../textarea-input'
// Utils
import { fetchOpenApiStaticProps } from './utils/fetch-open-api-static-props'
// Types
import type { OpenApiDocsViewProps } from 'views/open-api-docs-view/types'
// Styles
import s from './open-api-preview-inputs.module.css'

interface InputValues {
	openApiJsonString: string
	openApiDescription: string
	groupOperationsByPath: boolean
}

/**
 * Render a fixed panel container with inputs that allow control over the
 * static props for `OpenApiDocsView`.
 */
export function OpenApiPreviewInputs({
	setStaticProps,
}: {
	setStaticProps: (v: OpenApiDocsViewProps) => void
}) {
	const [error, setError] = useState<{
		title: string
		description: string
		error: string
	}>()
	const [isLoading, setIsLoading] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState(true)
	const [inputValues, setInputValues] = useState<InputValues>({
		openApiJsonString: '',
		openApiDescription: '',
		groupOperationsByPath: false,
	})

	/**
	 * Helper to set a specific input data value.
	 */
	function setInputValue(key: keyof InputValues, value: unknown) {
		setInputValues((p: InputValues) => ({ ...p, [key]: value }))
	}

	/**
	 * Whenever an input value changes, reset the error
	 */
	useEffect(() => {
		if (error) {
			setError(undefined)
		}
		// Note: intentionally not using exhaustive deps, reset based on input only
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValues])

	/**
	 * Pre-fill the description markdown when a new OpenAPI JSON string is set.
	 */
	useEffect(() => {
		// Avoid overwriting an in-progress description.
		if (inputValues.openApiDescription !== '') {
			return
		}
		try {
			// try to parse the input JSON, and set the description accordingly
			const parsed = JSON.parse(inputValues.openApiJsonString)
			const parsedValue = parsed?.info?.description
			if (parsedValue && inputValues.openApiDescription !== parsedValue) {
				setInputValue('openApiDescription', parsedValue)
			}
		} catch (e) {
			// do nothing if parsing fails
		}
	}, [inputValues])

	/**
	 * Fetch static props for the page and update state when
	 * the provided `inputValues` is submitted via a button activation.
	 */
	async function updateStaticProps() {
		setIsLoading(true)
		const [err, result] = await fetchOpenApiStaticProps(inputValues)
		if (err) {
			setError(err)
		} else {
			// Set a cookie with the unique file id
			document.cookie = `open-api-docs-preview-v2_unique-file-id=${result.uniqueFileId}`
			// Update the static props
			// TODO: really only using this to signal that the page needs a reload!
			// Could _maybe_ update it to actually populate the page... but meh?
			setStaticProps(result.staticProps)
		}
		setIsLoading(false)
	}

	/**
	 * Render the input panel
	 */
	return (
		<div className={classNames(s.root, { [s.isCollapsed]: isCollapsed })}>
			<div className={s.scrollableContent}>
				<div className={s.inputs}>
					<FileStringInput
						label="OpenAPI File"
						helperText='Upload your OpenAPI specification file, in ".json" format.'
						accept=".json"
						setValue={(v: string) => setInputValue('openApiJsonString', v)}
					/>
					<Button
						className={s.generateButton}
						text={isLoading ? 'Loading...' : 'Generate preview'}
						size="large"
						onClick={() => updateStaticProps()}
					/>
					{error ? (
						<InlineAlert
							color="critical"
							title={error.title}
							description={
								<>
									<div>{error.description}</div>
									<pre style={{ whiteSpace: 'pre-wrap' }}>
										<code>{error.error}</code>
									</pre>
								</>
							}
						/>
					) : null}
					<CheckboxField
						label="Group operations by path"
						helperText="By default, operations are organized by their first tag, which is expected to correspond to a service name. In some cases, spec files may have only a single tag, in which case this option can be used to group operations by their paths instead."
						checked={inputValues.groupOperationsByPath}
						onChange={() =>
							setInputValue(
								'groupOperationsByPath',
								!inputValues.groupOperationsByPath
							)
						}
					/>
					<TextareaInput
						label="Schema source"
						helperText="Test out edits to the uploaded OpenAPI specification file."
						value={inputValues.openApiJsonString}
						setValue={(v: string) => setInputValue('openApiJsonString', v)}
					/>
					<TextareaInput
						label="Description Markdown"
						helperText='Enter markdown here to override the "schema.info.description" field of your schema.'
						value={inputValues.openApiDescription}
						setValue={(v: string) => setInputValue('openApiDescription', v)}
					/>
				</div>
			</div>
			<div className={s.collapseButtonLayout}>
				<button
					className={s.collapseButton}
					onClick={() => setIsCollapsed((p: boolean) => !p)}
				>
					{isCollapsed ? 'Show' : 'Hide'} preview inputs
				</button>
			</div>
		</div>
	)
}
