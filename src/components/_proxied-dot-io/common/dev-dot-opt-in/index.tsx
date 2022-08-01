import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { IconAlertCircleFill16 } from '@hashicorp/flight-icons/svg-react/alert-circle-fill-16'
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

/**
 * Largely copied from: https://github.com/hashicorp/learn/pull/4480
 */
export default function DevDotOptIn() {
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
		<div className={s.container}>
			<IconAlertCircleFill16 className={s.icon} />
			<p className={s.alert}>
				The {name} website is being redesigned to help you find what you are
				looking for more effectively.
				<a
					className={s.optInLink}
					href={getDevDotLink(slug, asPath)}
					onClick={handleOptIn}
				>
					Join the Beta
				</a>
			</p>
		</div>
	)
}
