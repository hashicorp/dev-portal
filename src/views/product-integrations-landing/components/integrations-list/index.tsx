import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import Button from 'components/button'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import { Integration } from 'lib/integrations-api-client/integration'
import TagList, { GetIntegrationTags } from '../tag-list'
import s from './style.module.css'

interface IntegrationsListProps {
	integrations: Array<Integration>
	onClearFiltersClicked: () => void
}

export default function IntegrationsList({
	integrations,
	onClearFiltersClicked,
}: IntegrationsListProps) {
	return integrations.length ? (
		<CardsGridList fixedColumns={1}>
			{integrations.map((integration: Integration) => {
				return (
					<IntegrationCard key={integration.id} integration={integration} />
				)
			})}
		</CardsGridList>
	) : (
		<NoResultsMessage onClearFiltersClicked={onClearFiltersClicked} />
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
			ariaLabel={integration.name}
			className={s.integrationCard}
			href={url}
			opensInNewTab={isExternalLink}
		>
			<div className={s.cardContent}>
				<div className={s.left}>
					<div>
						<div className={s.nameVersionWrapper}>
							<h3 className={s.heading}>{integration.name}</h3>
							{!integration.hide_versions && (
								<span className={s.version}>v{integration.versions[0]}</span>
							)}
						</div>
						<span
							className={s.organization}
						>{`@${integration.organization.slug}`}</span>
					</div>
					<p className={s.body}>{integration.description}</p>
				</div>
				<div className={s.right}>
					<TagList
						className={s.tagList}
						tags={GetIntegrationTags(integration, false)}
					/>
					<span className={s.viewDetails}>
						View Details
						{isExternalLink ? <IconExternalLink16 /> : <IconArrowRight16 />}
					</span>
				</div>
			</div>
		</CardLink>
	)
}

interface NoResultsMessageProps {
	onClearFiltersClicked: () => void
}

function NoResultsMessage({ onClearFiltersClicked }: NoResultsMessageProps) {
	return (
		<div className={s.noResultsWrapper}>
			<p className={s.noResultsTitle}>No Results</p>
			<p className={s.noResultsDescription}>
				Try adjusting your selected filters or using different keywords.
			</p>
			<div className={s.noResultsButtonWrapper}>
				<Button
					onClick={(e) => {
						e.preventDefault()
						onClearFiltersClicked()
					}}
					color="secondary"
					text="Clear Filters"
					size="small"
					icon={<IconX16 />}
				/>
			</div>
		</div>
	)
}
