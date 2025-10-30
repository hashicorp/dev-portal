/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import Button from 'components/button'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { useTutorialContext } from 'contexts/tutorial-context'

export default function InteractiveLabButton() {
	const ctx = useInstruqtEmbed()
	const { tutorialLabId } = useTutorialContext()

	if (!tutorialLabId) {
		if (process.env.NODE_ENV === 'development') {
			console.log('[InteractiveLabButton] No tutorialLabId available')
		}
		return null
	}

	const isTutorialLabActive =
		ctx.active && ctx.labSource === 'tutorial' && ctx.labId === tutorialLabId

	const buttonText = `${isTutorialLabActive ? 'Hide' : 'Show'} Terminal`

	const handleClick = () => {
		if (process.env.NODE_ENV === 'development') {
			console.log('[InteractiveLabButton] Click:', {
				tutorialLabId,
				isTutorialLabActive,
				currentLabId: ctx.labId,
				currentLabSource: ctx.labSource,
				active: ctx.active,
			})
		}

		if (isTutorialLabActive) {
			ctx.closeLab()
		} else if (ctx.active && ctx.labSource === 'sandbox') {
			ctx.openLab(tutorialLabId, 'tutorial')
		} else {
			ctx.openLab(tutorialLabId, 'tutorial')
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
