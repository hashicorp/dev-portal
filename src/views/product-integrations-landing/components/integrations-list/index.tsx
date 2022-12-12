import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import { Integration } from 'lib/integrations-api-client/integration'
import TierBadge from '../tier-badge'
import s from './style.module.css'

interface IntegrationsListProps {
	integrations: Array<Integration>
}

export default function IntegrationsList({
	integrations,
}: IntegrationsListProps) {
	return (
		<CardsGridList fixedColumns={1}>
			{integrations.map((integration: Integration) => {
				return (
					<IntegrationCard key={integration.id} integration={integration} />
				)
			})}
		</CardsGridList>
	)
}

interface IntegrationCardProps {
	integration: Integration
}

function IntegrationCard({ integration }: IntegrationCardProps) {
	const url = integration.external_only
		? integration.external_url.replace(/^https:\/\/developer.hashicorp.com/, '')
		: `/${integration.product.slug}/integrations/${integration.slug}`

	return (
		<CardLink ariaLabel="TODO" className={s.integrationCard} href={url}>
			<div className={s.header}>
				<div className={s.headingWrapper}>
					<h3 className={s.heading}>{integration.name}</h3>
					{!integration.hide_versions && (
						<span className={s.version}>v{integration.versions[0]}</span>
					)}
				</div>
				<TierBadge
					tier={integration.tier}
					productSlug={integration.product.slug}
					size="small"
				/>
			</div>
			<span
				className={s.organization}
			>{`@${integration.organization.slug}`}</span>
			<p className={s.body}>{integration.description}</p>
		</CardLink>
	)
}
