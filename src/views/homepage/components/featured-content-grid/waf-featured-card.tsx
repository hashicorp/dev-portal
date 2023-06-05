/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineSvg from '@hashicorp/react-inline-svg'
import wafGraphic from '../../img/waf-graphic.svg?include'
import FeaturedCard from './featured-card'
import s from './waf-featured-card.module.css'

const WafFeaturedCard = () => {
	const title = 'Well-Architected Framework: product best practices'

	return (
		<FeaturedCard
			className={s.wafCard}
			href="/well-architected-framework"
			title={title}
		>
			<div className={s.wafCardContent}>
				<InlineSvg className={s.wafGraphic} src={wafGraphic} />
				<h2 className={s.title}>{title}</h2>
			</div>
		</FeaturedCard>
	)
}

export default WafFeaturedCard
