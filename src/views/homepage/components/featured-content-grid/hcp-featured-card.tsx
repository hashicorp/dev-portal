/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import hcpLogo from 'lib/mktg-logos/hcp-horizontal_on-dark.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'
import FeaturedCard from './featured-card'
import s from './hcp-featured-card.module.css'

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

export default HcpFeaturedCard
