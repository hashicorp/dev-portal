/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import Image from 'next/image'

// HashiCorp imports
import hcpLogo from '@hashicorp/mktg-logos/product/hcp/primary/white.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'

// Global imports
import Heading from 'components/heading'
import Text from 'components/text'

// Local imports
import certificationsGraphic from '../../img/certifications-graphic.svg'
import wafGraphic from '../../img/waf-graphic.svg?include'
import FeaturedCard from './featured-card'
import SearchFeaturedCard from './search-featured-card'
import s from './featured-content-grid.module.css'

const CertificationsFeaturedCard = () => {
	const title = 'Get HashiCorp certified'

	return (
		<FeaturedCard
			className={s.certificationsCard}
			href="/certifications"
			title={title}
		>
			<div className={s.certificationsCardContent}>
				<Image
					alt=""
					className={s.certificationsGraphic}
					height={286}
					src={certificationsGraphic}
					width={373}
				/>
				<div className={s.certificationsCardContentText}>
					<Heading level={2} size={400} weight="bold">
						{title}
					</Heading>
					<Text asElement="p" size={300} weight="regular">
						Earn certifications to verify your skills and communicate your
						proficiency with HashiCorp multi-cloud products.
					</Text>
				</div>
			</div>
		</FeaturedCard>
	)
}

/**
 * @TODO The graphic for this component needs refined, but that will take some
 * Design work in Figma. Will resolve in VQA.
 */
const HcpFeaturedCard = () => {
	const title = 'HashiCorp Cloud Platform'

	return (
		<FeaturedCard className={s.hcpCard} href="/hcp" title={title}>
			<h2 aria-label={title} className={s.hcpCardTitle}>
				<InlineSvg aria-hidden="true" className={s.hcpLogo} src={hcpLogo} />
			</h2>
			<p className={s.hcpCardBody}>
				The fastest way to get up and running with HashiCorp products
			</p>
		</FeaturedCard>
	)
}

const WafFeaturedCard = () => {
	const title = 'What is HashiCorp’s Well-Architected Framework?'

	return (
		<FeaturedCard
			className={s.wafCard}
			href="/well-architected-framework"
			title={title}
		>
			<div className={s.wafCardContent}>
				<InlineSvg className={s.wafGraphic} src={wafGraphic} />
				<Heading level={2} size={400} weight="bold">
					{title}
				</Heading>
			</div>
		</FeaturedCard>
	)
}

const FeaturedContentGrid = () => {
	return (
		<div className={s.root}>
			<div className={s.gridAreaA}>
				<SearchFeaturedCard />
			</div>
			<div className={s.gridAreaB}>
				<CertificationsFeaturedCard />
			</div>
			<div className={s.gridAreaC}>
				<HcpFeaturedCard />
			</div>
			<div className={s.gridAreaD}>
				<WafFeaturedCard />
			</div>
		</div>
	)
}

export { FeaturedContentGrid }
