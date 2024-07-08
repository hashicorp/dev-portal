/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useId, type ChangeEvent } from 'react'
import s from './file-string-input.module.css'

/**
 * Render a very basic file input.
 *
 * This is a temporary solution until we have a React version of FileInput
 * set up, which we'd likely do in the `web` monorepo.
 *
 * For now, this felt sufficient for an internal preview tool for OpenAPI specs.
 */
export function FileStringInput({
	label,
	helperText,
	accept,
	setValue,
}: {
	label: string
	helperText?: string
	accept: string
	setValue: (fileString: string) => void
}) {
	const id = useId()

	function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
		const fileReader = new FileReader()
		fileReader.readAsText(e.target.files[0], 'UTF-8')
		fileReader.onload = (e: ProgressEvent<FileReader>) =>
			setValue(e.target.result.toString())
	}

	return (
		<div className={s.root}>
			<div>
				<label htmlFor={id}>{label}</label>
				{helperText ? <div className={s.helperText}>{helperText}</div> : null}
			</div>
			<input
				id={id}
				type="file"
				accept={accept}
				onChange={handleFileInputChange}
			/>
		</div>
	)
}
