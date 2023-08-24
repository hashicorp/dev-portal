import { useId, type ChangeEvent } from 'react'

/**
 * Render an input that's kind of a knock-off version of HDS's FileInput.
 * This is a temporary solution until we have a React version of FileInput
 * set up, which we'd likely do in the `web` monorepo.
 *
 * For now, this felt sufficient for an internal preview tool for OpenAPI specs.
 */
export function FileStringInput({
	label,
	accept,
	setValue,
}: {
	label: string
	accept: string
	setValue: (fileString: string) => void
}) {
	const id = useId()

	function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
		const fileReader = new FileReader()
		fileReader.readAsText(e.target.files[0], 'UTF-8')
		fileReader.onload = (e) => setValue(e.target.result.toString())
	}

	return (
		<div className="hds-form-field--layout-vertical">
			<label
				className="hds-form-label hds-form-field__label hds-typography-body-200 hds-font-weight-semibold"
				htmlFor={id}
			>
				{label}
			</label>
			<div className="hds-form-field__control">
				<input
					id={id}
					type="file"
					className="hds-form-file-input hds-typography-body-200"
					accept={accept}
					onChange={handleFileInputChange}
				/>
			</div>
		</div>
	)
}
