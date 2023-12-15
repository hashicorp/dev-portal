/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import { useCurrentProduct } from 'contexts'
import s from './landing-hero.module.css'
import { DocsLandingHeroProps } from './types'

const DocsLandingHero = ({
	pageHeading,
	pageSubtitle,
}: DocsLandingHeroProps) => {
	const currentProduct = useCurrentProduct()

	const hasSubtitle = !!pageSubtitle

	return (
		<div className={classNames(s.root, { [s.hasSubtitle]: hasSubtitle })}>
			<IconTileLogo
				productSlug={
					currentProduct.slug === 'sentinel' ? 'hcp' : currentProduct.slug
				}
				className={s.icon}
			/>
			<div>
				<Heading
					className={s.pageTitle}
					id={pageHeading.id}
					level={1}
					size={600}
					weight="bold"
				>
					{pageHeading.title}
				</Heading>
				{hasSubtitle ? (
					<Text className={s.pageSubtitle}>{pageSubtitle}</Text>
				) : null}
			</div>
		</div>
	)
}

export default DocsLandingHero
