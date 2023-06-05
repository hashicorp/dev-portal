/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Image from 'next/legacy/image'
import Button from 'components/button'
import Card from 'components/card'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import s from './interactive-lab-callout.module.css'

export default function InteractiveLabCallout() {
	const ctx = useInstruqtEmbed()

	if (!ctx.labId) {
		return null
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
						data-heap-track="interactive-lab-callout"
						color="secondary"
						text="Start interactive lab"
						onClick={() => ctx.setActive(true)}
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
