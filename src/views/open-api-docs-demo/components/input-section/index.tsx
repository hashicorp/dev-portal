import { useState } from 'react'
// Icons
import { IconCode16 } from '@hashicorp/flight-icons/svg-react/code-16'
// Components
import Text from 'components/text'
// Local
import { FileStringInput } from '../'
// Styles
import s from './input-section.module.css'
import classNames from 'classnames'

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
	const [shown, setShown] = useState(false)
	return (
		<div className={classNames(s.root, { [s.shown]: shown })}>
			<button className={s.hideShow} onClick={() => setShown(!shown)}>
				<IconCode16 />
				<Text>Upload .json</Text>
			</button>
			<div className={s.container}>
				<div className={s.instructions}>
					<Text>
						Upload an OpenAPI .json file, or paste the file contents into the
						text area.
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
		</div>
	)
}
