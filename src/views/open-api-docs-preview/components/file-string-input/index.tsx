import { useId, type ChangeEvent } from 'react'
import s from './file-string-input.module.css'

export function FileStringInput({
	label,
	accept,
	value,
	setValue,
}: {
	label: string
	accept: string
	value: string
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
