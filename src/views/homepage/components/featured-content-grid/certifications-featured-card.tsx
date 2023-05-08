/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Image from 'next/image'
import certificationsGraphic from '../../img/certifications-graphic.svg'
import FeaturedCard from './featured-card'
import s from './certifications-featured-card.module.css'

const CertificationsFeaturedCard = () => {
	const title = 'Get HashiCorp certified'
	const body =
		'Earn certifications to verify your skills and communicate your proficiency with HashiCorp multi-cloud products.'

	return (
		<FeaturedCard
			className={s.certificationsCard}
			href="/certifications"
			title={title}
		>
			<div className={s.certificationsCardContent}>
				<div className={s.graphicContainer}>
					<Image
						alt=""
						className={s.certificationsGraphic}
						height={528}
						width={498}
						src={certificationsGraphic}
					/>
				</div>
				<div className={s.certificationsCardContentText}>
					<h2 className={s.title}>{title}</h2>
					<p className={s.body}>{body}</p>
				</div>
			</div>
		</FeaturedCard>
	)
}

export default CertificationsFeaturedCard
