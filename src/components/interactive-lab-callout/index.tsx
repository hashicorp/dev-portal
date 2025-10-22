/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Image from 'next/legacy/image'
import Button from 'components/button'
import Card from 'components/card'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { FC } from 'react'
import s from './interactive-lab-callout.module.css'
import SANDBOX_CONFIG from 'content/sandbox/sandbox.json' assert { type: 'json' }

interface InteractiveLabCalloutProps {
	labId?: string
}

const InteractiveLabCallout: FC<InteractiveLabCalloutProps> = ({ labId }) => {
	const ctx = useInstruqtEmbed()
	let effectiveLabId = labId || ctx.labId

	if (!effectiveLabId && ctx && ctx.productSlug) {
		const fallbackLab = SANDBOX_CONFIG?.labs?.find((lab) =>
			lab.products?.includes(ctx.productSlug)
		)
		if (fallbackLab) {
			effectiveLabId = fallbackLab.labId
		}
	}

	if (!effectiveLabId && SANDBOX_CONFIG?.labs?.length > 0) {
		effectiveLabId = SANDBOX_CONFIG.labs[0].instruqtTrack
	}

	const handleStartLab = () => {
		if (effectiveLabId) {
			ctx.openLab(effectiveLabId)
			ctx.setActive(true)
		} else {
			ctx.setActive(true)
		}
	}

	return (
		<Card className={s.interactiveCallout} elevation="base">
			<div>
				<p className={s.title}>Launch Terminal</p>
				<p className={s.description}>
					This tutorial includes a free interactive command-line lab that lets
					you follow along on actual cloud infrastructure.
				</p>
				<div className={s.ctaButton}>
					<Button
						color="secondary"
						text="Start interactive lab"
						onClick={handleStartLab}
						size="small"
					/>
				</div>
			</div>
			<div className={s.image}>
				<Image
					src={require('./img/interactive-callout-visual.svg')}
					width={133}
					height={100}
					alt=""
					layout="responsive"
				/>
			</div>
		</Card>
	)
}

export default InteractiveLabCallout
