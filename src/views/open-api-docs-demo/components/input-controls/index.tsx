import s from './input-controls.module.css'

function InputControls({
	setFileString,
}: {
	setFileString: (fileString: string) => void
}) {
	const handleChange = (e) => {
		const fileReader = new FileReader()
		fileReader.readAsText(e.target.files[0], 'UTF-8')
		fileReader.onload = (e) => {
			console.log('e.target.result', e.target.result)
			setFileString(e.target.result.toString())
		}
	}

	return (
		<div className={s.root}>
			<input type="file" accept=".json" onChange={handleChange} />
		</div>
	)
}

export { InputControls }
