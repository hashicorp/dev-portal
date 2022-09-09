import { SupportedCommand, useCommandBar } from 'components/command-bar'
import s from './command-bar-dialog.module.css'

const CommandBarDialogBody = () => {
	const { currentCommand, setCurrentCommand } = useCommandBar()
	const { DialogBody } = currentCommand

	return (
		<div className={s.body}>
			<button
				onClick={() => {
					if (currentCommand.name === SupportedCommand.search) {
						setCurrentCommand(SupportedCommand.settings)
					} else {
						setCurrentCommand(SupportedCommand.search)
					}
				}}
			>
				toggle command
			</button>
			<DialogBody />
		</div>
	)
}

export default CommandBarDialogBody
