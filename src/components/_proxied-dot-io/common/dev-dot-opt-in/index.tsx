import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { IconAlertCircle16 } from '@hashicorp/flight-icons/svg-react/alert-circle-16'
import ButtonLink from 'components/button-link'
import Text from 'components/text'
import useProductMeta from '@hashicorp/platform-product-meta'
import { ProductSlug } from 'types/products'
import { isContentDeployPreview } from 'lib/env-checks'
import getIsBetaProduct from 'lib/get-is-beta-product'
import s from './dev-dot-opt-in.module.css'

const DAYS_UNTIL_EXPIRE = 180

const getDevDotLink = (product, path) => {
	const pathWithoutProxy = path.includes('_proxied-dot-io')
		? path.split('/').slice(3).join('/') // remove proxy path segments, which are present during SSR
		: path.slice(1) // remove leading slash
	const url = new URL(
		`/${product}/${pathWithoutProxy}`,
		__config.dev_dot.canonical_base_url
	)
	url.searchParams.set('optInFrom', `${product}-io`)

	return url.toString()
}

interface DevDotOptInProps {
	cutoverDate?: string
	showCutoverDate?: boolean
}

/**
 * Largely copied from: https://github.com/hashicorp/learn/pull/4480
 */
export default function DevDotOptIn({
	cutoverDate,
	showCutoverDate,
}: DevDotOptInProps) {
	const { asPath } = useRouter()
	const { name, slug } = useProductMeta()

	// Based on our config values, decide whether or not we should render the CTA
	const shouldRenderOptInCTA =
		!isContentDeployPreview(slug) &&
		getIsBetaProduct(slug as ProductSlug) &&
		__config.flags.enable_io_beta_cta

	// Return `null` if the CTA should not be rendered
	if (!shouldRenderOptInCTA) {
		return null
	}

	function handleOptIn() {
		// Set a cookie to ensure any future navigation will send them to dev dot
		Cookies.set(`${slug}-io-beta-opt-in`, true, {
			expires: DAYS_UNTIL_EXPIRE,
		})
	}

	return (
		<div className={s.root}>
			<div className={s.alertContainer}>
				<div className={s.icon}>
					<IconAlertCircle16 />
				</div>
				<div className={s.contentContainer}>
					<Text className={s.title} size={200} weight="semibold">
						A new platform for documentation and tutorials is launching soon.
					</Text>
					<Text className={s.description} size={200}>
						{`We are migrating ${name} documentation into HashiCorp Developer, our new developer experience.${
							cutoverDate && showCutoverDate
								? ` The migration will take place on ${cutoverDate}`
								: ''
						}`}
					</Text>
					<div className={s.actions}>
						<ButtonLink
							text="Join Now"
							href={getDevDotLink(slug, asPath)}
							onClick={handleOptIn}
							color="secondary"
							size="small"
						/>
						{/* commented out until blog post is published */}
						{/* <StandaloneLink
							icon={<IconArrowRight16 />}
							iconPosition="trailing"
							text="Learn More"
							href=""
							color="secondary"
							size="small"
						/> */}
					</div>
				</div>
			</div>
		</div>
	)
}
