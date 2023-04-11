/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// HashiCorp imports
import InlineSvg from '@hashicorp/react-inline-svg'

// Global imports
import Heading from 'components/heading'

// Local imports
import wafGraphic from '../../img/waf-graphic.svg?include'
import CertificationsFeaturedCard from './certifications-featured-card'
import FeaturedCard from './featured-card'
import HcpFeaturedCard from './hcp-featured-card'
import SearchFeaturedCard from './search-featured-card'
import s from './featured-content-grid.module.css'

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
