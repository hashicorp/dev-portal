import Text from 'components/text'
import AccordionDisclosure from 'components/accordion-disclosure'
// Local
import { FileStringInput } from '../'
// Styles
import s from './input-section.module.css'

/**
 * Render some basic UI to allow uploading or pasting an OpenAPI spec file.
 */
export function InputSection({
	fileString,
	setFileString,
}: {
	fileString: string
	setFileString: (fileString: string) => void
}) {
	return (
		<div className={s.root}>
			<AccordionDisclosure title="Preview your .swagger.json" initialOpen>
				<div className={s.container}>
					<div className={s.instructions}>
						<Text>
							Upload an OpenAPI .swagger.json file, or paste the file contents
							into the text area.
						</Text>
						<span className={s.fileInput}>
							<FileStringInput accept=".json" setFileString={setFileString} />
						</span>
					</div>
					<textarea
						className={s.textArea}
						value={fileString}
						onChange={(e) => setFileString(e.target.value)}
					/>
				</div>
			</AccordionDisclosure>
		</div>
	)
}
