import consulGraphic from './img/consul.svg'
import terraformGraphic from './img/terraform.svg'
import vaultGraphic from './img/vault.svg'
import TutorialsLandingContentCardLink from '../tutorials-landing-content-card-link'

const PRODUCT_SLUGS_TO_BACKGROUND_IMAGES = {
	consul: {
		url: consulGraphic,
		lightOrDark: 'dark',
	},
	terraform: {
		url: terraformGraphic,
		lightOrDark: 'dark',
	},
	vault: {
		url: vaultGraphic,
		lightOrDark: 'light',
	},
}

type TutorialsLandingCertificationContentCardLinkProps = $TSFixMe

const TutorialsLandingCertificationContentCardLink = ({
	productSlug,
	description,
	href,
	title,
}: TutorialsLandingCertificationContentCardLinkProps) => {
	const { url, lightOrDark } = PRODUCT_SLUGS_TO_BACKGROUND_IMAGES[productSlug]
	return (
		<TutorialsLandingContentCardLink
			backgroundImageUrl={url}
			backgroundImageColor={lightOrDark}
			title={title}
			description={description}
			href={href}
		/>
	)
}

export default TutorialsLandingCertificationContentCardLink
