import InlineSvg from '@hashicorp/react-inline-svg'
import s from './cmd-ctrl-icon.module.css'

const CmdCtrlIcon = () => {
	return (
		<InlineSvg className={s.root} src={require('./cmd-ctrl.svg?include')} />
	)
}

export { CmdCtrlIcon }
