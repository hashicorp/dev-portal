/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import Button from 'components/button'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'

export default function InteractiveLabButton() {
	const ctx = useInstruqtEmbed()

	const hasLab = ctx.tutorialLabId || ctx.labId

	if (!hasLab) {
		return null
	}

	const buttonText = `${ctx.active ? 'Hide' : 'Show'} Terminal`

	const handleClick = () => {
		if (ctx.active) {
			ctx.setActive(false)
		} else {
			const labIdToOpen = ctx.tutorialLabId || ctx.labId
			if (labIdToOpen) {
				ctx.openLab(labIdToOpen, 'tutorial')
			}
			ctx.setActive(true)
		}
	}

	return (
		<Button
			text={buttonText}
			onClick={handleClick}
			icon={<IconTerminalScreen16 />}
			color="secondary"
			size="small"
		/>
	)
}
