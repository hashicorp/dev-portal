import { useCommandBar } from 'components/command-bar'
import s from './command-bar-dialog.module.css'

const CommandBarDialogBody = () => {
	const { currentCommand } = useCommandBar()
	const { DialogBody } = currentCommand

	return (
		<div className={s.body}>
			<DialogBody />
		</div>
	)
}

export default CommandBarDialogBody
