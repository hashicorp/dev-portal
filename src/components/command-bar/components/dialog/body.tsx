import { useCurrentContentType } from 'contexts'
import s from './command-bar-dialog.module.css'

const CommandBarDialogBody = () => {
	const currentContentType = useCurrentContentType()

	return (
		<div className={s.body}>
			<div>Current content type: {currentContentType}</div>
		</div>
	)
}

export default CommandBarDialogBody
