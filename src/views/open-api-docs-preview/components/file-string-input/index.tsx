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
	const fileInputId = useId()
	const textareaId = useId()

	function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
		const fileReader = new FileReader()
		fileReader.readAsText(e.target.files[0], 'UTF-8')
		fileReader.onload = (e) => setValue(e.target.result.toString())
	}

	return (
		<div className={s.root}>
			<label htmlFor={fileInputId}>{label}</label>
			<input
				id={fileInputId}
				type="file"
				accept={accept}
				onChange={handleFileInputChange}
			/>
			<label className="g-screen-reader-only" htmlFor={textareaId}>
				{label} File String
			</label>
			<textarea
				style={{ width: '100%', height: '200px', resize: 'vertical' }}
				id={textareaId}
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
		</div>
	)
}
