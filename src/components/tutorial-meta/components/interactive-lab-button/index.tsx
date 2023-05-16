/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import Button from 'components/button'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import s from './interactive-lab-button.module.css'

export default function InteractiveLabButton() {
	const ctx = useInstruqtEmbed()

	if (!ctx.labId) {
		return null
	}

	const buttonText = `${ctx.active ? 'Hide' : 'Show'} Terminal`

	return (
		<Button
			className={s.button}
			text={buttonText}
			onClick={() => ctx.setActive(!ctx.active)}
			icon={<IconTerminalScreen16 />}
			data-heap-track="interactive-lab-button"
			color="secondary"
			size="small"
		/>
	)
}
