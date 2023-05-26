import { type CertificationContentCardLinkProps } from '../types'
import TutorialsLandingContentCardLink from '../content-card-link'
import consulGraphic from './img/consul.svg'
import terraformGraphic from './img/terraform.svg'
import vaultGraphic from './img/vault.svg'

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

const CertificationContentCardLink = ({
	productSlug,
	description,
	href,
	title,
}: CertificationContentCardLinkProps) => {
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

export default CertificationContentCardLink
