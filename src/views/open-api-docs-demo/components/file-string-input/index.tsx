import type { ChangeEvent } from 'react'

export function FileStringInput({
	accept,
	setFileString,
}: {
	accept: string
	setFileString: (fileString: string) => void
}) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const fileReader = new FileReader()
		fileReader.readAsText(e.target.files[0], 'UTF-8')
		fileReader.onload = (e) => setFileString(e.target.result.toString())
	}

	return <input type="file" accept={accept} onChange={handleChange} />
}
