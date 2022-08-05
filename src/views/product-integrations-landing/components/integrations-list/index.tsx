import s from './style.module.css'
import CardsGridList from 'components/cards-grid-list'
import CardLink from 'components/card-link'
import { IconAward16 } from '@hashicorp/flight-icons/svg-react/award-16'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'

export default function IntegrationsList({ integrations }) {
	return (
		<CardsGridList>
			{integrations.map((integration) => {
				return (
					<IntegrationCard
						key={integration.id}
						title={integration.name}
						description={integration.description}
						organization={integration.organization.slug}
						productSlug={integration.product.slug}
						tier={integration.tier}
						repoUrl={integration.repo_url}
					/>
				)
			})}
		</CardsGridList>
	)
}

function IntegrationCard({
	title,
	description,
	organization,
	tier,
	repoUrl,
	productSlug,
}) {
	return (
		<CardLink className={s.integrationCard} href={repoUrl} openInNewTab={true}>
			<div className={s.header}>
				<h3 className={s.heading}>{title}</h3>
				<TierBadge tier={tier} productSlug={productSlug} />
			</div>

			<span className={s.organization}>{`@${organization}`}</span>
			<p className={s.body}>{description}</p>
		</CardLink>
	)
}

function TierBadge({ tier, productSlug }) {
	return (
		<span
			className={s.badge}
			style={{
				'--badge-color': `var(--token-color-${productSlug}-surface)`,
			}}
		>
			{tier === 'official' && (
				<>
					<IconAward16 /> Official
				</>
			)}
			{tier === 'verified' && (
				<>
					<IconCheckCircle16 /> Verified
				</>
			)}
			{tier === 'community' && <>Community</>}
		</span>
	)
}
