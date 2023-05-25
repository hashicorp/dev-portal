import TutorialsLandingContentCardLink from '../tutorials-landing-content-card-link'
import boundaryGraphic from './img/boundary.svg'
import consulGraphic from './img/consul.svg'
import nomadGraphic from './img/nomad.svg'
import packerGraphic from './img/packer.svg'
import terraformGraphic from './img/terraform.svg'
import vagrantGraphic from './img/vagrant.svg'
import vaultGraphic from './img/vault.svg'
import waypointGraphic from './img/waypoint.svg'

const PRODUCT_SLUGS_TO_HEADER_IMAGES = {
	boundary: boundaryGraphic,
	consul: consulGraphic,
	nomad: nomadGraphic,
	packer: packerGraphic,
	terraform: terraformGraphic,
	vagrant: vagrantGraphic,
	vault: vaultGraphic,
	waypoint: waypointGraphic,
}

type TutorialsLandingCollectionContentCardLinkProps = $TSFixMe

const TutorialsLandingCollectionContentCardLink = ({
	badges,
	description,
	href,
	name,
	productSlug,
	tutorialCount,
}: TutorialsLandingCollectionContentCardLinkProps) => {
	return (
		<TutorialsLandingContentCardLink
			headerImageUrl={PRODUCT_SLUGS_TO_HEADER_IMAGES[productSlug]}
			badges={badges}
			description={description}
			title={name}
			href={href}
			eyebrowParts={[
				'Learning path',
				`${tutorialCount} tutorial${tutorialCount > 1 ? 's' : ''}`,
			]}
		/>
	)
}

export default TutorialsLandingCollectionContentCardLink
