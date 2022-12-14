import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import { Integration } from 'lib/integrations-api-client/integration'
import TagList, { GetIntegrationTags } from '../tag-list'
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

	const isExternalLink = !url.startsWith('/')

	return (
		<CardLink
			ariaLabel="TODO"
			className={s.integrationCard}
			href={url}
			opensInNewTab={isExternalLink}
		>
			<div className={s.cardContent}>
				<div className={s.left}>
					<div className={s.nameVersionWrapper}>
						<h3 className={s.heading}>{integration.name}</h3>
						{!integration.hide_versions && (
							<span className={s.version}>v{integration.versions[0]}</span>
						)}
					</div>
					<span
						className={s.organization}
					>{`@${integration.organization.slug}`}</span>
					<p className={s.body}>{integration.description}</p>
				</div>
				<div className={s.right}>
					<TagList tags={GetIntegrationTags(integration, false)} />
					<span className={s.viewDetails}>
						View Details
						{isExternalLink ? <IconExternalLink16 /> : <IconArrowRight16 />}
					</span>
				</div>
			</div>
		</CardLink>
	)
}
