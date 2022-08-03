import { ReactElement } from 'react'
import Link from 'next/link'
import slugify from 'slugify'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { productSlugsToHostNames } from 'lib/products'
import { useCurrentProduct } from 'contexts'
import Card from 'components/card'
import StandaloneLink from 'components/standalone-link'
import Text from 'components/text'
import { SidecarMarketingCardProps } from './types'
import s from './sidecar-marketing-card.module.css'

const SidecarMarketingCard = ({
	title,
	subtitle,
	featuredDocsLinks,
}: SidecarMarketingCardProps): ReactElement => {
	const currentProduct = useCurrentProduct()
	const learnMoreLink = `https://${
		productSlugsToHostNames[currentProduct.slug]
	}`

	return (
		<Card elevation="base">
			<Text className={s.cardTitle} size={300} weight="semibold">
				{title}
			</Text>
			<Text className={s.cardSubtitle} size={200} weight="regular">
				{subtitle}
			</Text>
			<StandaloneLink
				color="secondary"
				href={learnMoreLink}
				icon={<IconExternalLink16 />}
				iconPosition="trailing"
				openInNewTab
				text="Learn more"
			/>
			<Text className={s.featuredDocsLabel} size={200} weight="semibold">
				Featured docs
			</Text>
			<ul className={s.featuredDocsLinksList}>
				{featuredDocsLinks.map(({ href, text }) => (
					<Text
						className={s.featuredDocsListItem}
						asElement="li"
						key={slugify(text)}
						size={200}
						weight="regular"
					>
						<Link href={href}>
							<a className={s.featuredDocsLink}>{text}</a>
						</Link>
					</Text>
				))}
			</ul>
		</Card>
	)
}

export type { SidecarMarketingCardProps }
export default SidecarMarketingCard
