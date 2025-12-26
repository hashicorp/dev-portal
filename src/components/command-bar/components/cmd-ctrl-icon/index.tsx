/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineSvg from '@hashicorp/react-inline-svg'
import s from './cmd-ctrl-icon.module.css'

const CmdCtrlIcon = () => {
	return (
		<InlineSvg className={s.root} src={require('./cmd-ctrl.svg?include')} />
	)
}

export { CmdCtrlIcon }
