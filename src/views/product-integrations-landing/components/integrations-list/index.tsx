import s from './style.module.css'
import CardsGridList from 'components/cards-grid-list'
import CardLink from 'components/card-link'
import TierBadge from '../tier-badge'

export default function IntegrationsList({ integrations }) {
	return (
		<CardsGridList fixedColumns={2}>
			{integrations.map((integration) => {
				const url = integration.external_only
					? integration.external_url.replace(
							/^https:\/\/developer.hashicorp.com/,
							''
					  )
					: `/${integration.product.slug}/integrations/${integration.slug}`
				return (
					<IntegrationCard
						key={integration.id}
						title={integration.name}
						description={integration.description}
						latestVersion={integration.versions[0]}
						organization={integration.organization.slug}
						productSlug={integration.product.slug}
						tier={integration.tier}
						url={url}
					/>
				)
			})}
		</CardsGridList>
	)
}

function IntegrationCard({
	title,
	latestVersion,
	description,
	organization,
	tier,
	productSlug,
	url,
}) {
	return (
		<CardLink ariaLabel="TODO" className={s.integrationCard} href={url}>
			<div className={s.header}>
				<div className={s.headingWrapper}>
					<h3 className={s.heading}>{title}</h3>
					<span className={s.version}>v{latestVersion}</span>
				</div>
				<TierBadge tier={tier} productSlug={productSlug} size="small" />
			</div>

			<span className={s.organization}>{`@${organization}`}</span>
			<p className={s.body}>{description}</p>
		</CardLink>
	)
}
