import semverRSort from 'semver/functions/rsort'
import semverPrerelease from 'semver/functions/prerelease'
import semverValid from 'semver/functions/valid'
import { ProductData } from 'types/products'
import { ReleaseVersion } from 'lib/fetch-release-data'
import {
	getInlineCollections,
	getInlineTutorials,
} from 'views/product-tutorials-view/helpers/get-inline-content'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import { VersionContextSwitcherProps } from 'components/version-context-switcher'
import { PackageManager, SortedReleases } from './types'
import { CollectionLite } from 'lib/learn-client/types'

const PLATFORM_MAP = {
	Mac: 'darwin',
	Win: 'windows',
	Linux: 'linux',
}

export const generateDefaultPackageManagers = (
	product: Pick<ProductData, 'slug'>
): PackageManager[] => {
	const productSlug = product.slug

	return [
		{
			label: 'Homebrew',
			commands: [
				`brew tap hashicorp/tap`,
				`brew install hashicorp/tap/${productSlug}`,
			],
			os: 'darwin',
		},
		{
			label: 'Ubuntu/Debian',
			commands: [
				`wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg`,
				`echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list`,
				`sudo apt update && sudo apt install ${productSlug}`,
			],
			os: 'linux',
		},
		{
			label: 'CentOS/RHEL',
			commands: [
				`sudo yum install -y yum-utils`,
				`sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo`,
				`sudo yum -y install ${productSlug}`,
			],
			os: 'linux',
		},
		{
			label: 'Fedora',
			commands: [
				`sudo dnf install -y dnf-plugins-core`,
				`sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo`,
				`sudo dnf -y install ${productSlug}`,
			],
			os: 'linux',
		},
		{
			label: 'Amazon Linux',
			commands: [
				`sudo yum install -y yum-utils`,
				`sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo`,
				`sudo yum -y install ${productSlug}`,
			],
			os: 'linux',
		},
		{
			label: 'Homebrew',
			commands: [
				`brew tap hashicorp/tap`,
				`brew install hashicorp/tap/${productSlug}`,
			],
			os: 'linux',
		},
	]
}

export function generateEnterprisePackageManagers(
	product: Pick<ProductData, 'slug'>
): PackageManager[] {
	const productSlug = product.slug

	return [
		{
			label: 'Ubuntu/Debian',
			commands: [
				`wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg`,
				`echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list`,
				`sudo apt update && sudo apt install ${productSlug}-enterprise`,
			],
			os: 'linux',
		},
		{
			label: 'CentOS/RHEL',
			commands: [
				`sudo yum install -y yum-utils`,
				`sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo`,
				`sudo yum -y install ${productSlug}-enterprise`,
			],
			os: 'linux',
		},
		{
			label: 'Fedora',
			commands: [
				`sudo dnf install -y dnf-plugins-core`,
				`sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo`,
				`sudo dnf -y install ${productSlug}-enterprise`,
			],
			os: 'linux',
		},
		{
			label: 'Amazon Linux',
			commands: [
				`sudo yum install -y yum-utils`,
				`sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo`,
				`sudo yum -y install ${productSlug}-enterprise`,
			],
			os: 'linux',
		},
	]
}

export const generatePackageManagers = ({
	defaultPackageManagers,
	packageManagerOverrides,
}: {
	defaultPackageManagers: PackageManager[]
	packageManagerOverrides: PackageManager[]
}): PackageManager[] => {
	let packageManagers: PackageManager[]

	if (packageManagerOverrides) {
		packageManagers = defaultPackageManagers.map((defaultPackageManager) => {
			const override = packageManagerOverrides.find(
				({ os, label }) =>
					os === defaultPackageManager.os &&
					label === defaultPackageManager.label
			)
			return override || defaultPackageManager
		})
	} else {
		packageManagers = defaultPackageManagers
	}

	return packageManagers
}

export const getPageSubtitle = ({
	productName,
	version,
	isLatestVersion,
}: {
	productName: string
	version: string
	isLatestVersion: boolean
}): string => {
	const versionText = `v${version}${isLatestVersion ? ' (latest version)' : ''}`
	return `Install or update to ${versionText} of ${productName} to get started.`
}

export const initializeBreadcrumbLinks = (
	currentProduct: Pick<ProductData, 'name' | 'slug'>,
	selectedVersion: string,
	isEnterpriseMode: boolean
): BreadcrumbLink[] => {
	return [
		{
			title: 'Developer',
			url: '/',
		},
		{
			title: currentProduct.name,
			url: `/${currentProduct.slug}`,
		},
		{
			isCurrentPage: true,
			title: isEnterpriseMode
				? `Install ${currentProduct.name} Enterprise`
				: `Install v${selectedVersion}`,
			url: isEnterpriseMode
				? `/${currentProduct.slug}/downloads/enterprise`
				: `/${currentProduct.slug}/downloads`,
		},
	]
}

export const initializeVersionSwitcherOptions = ({
	latestVersion,
	releaseVersions,
}: {
	latestVersion: ReleaseVersion['version']
	releaseVersions: ReleaseVersion[]
}): VersionContextSwitcherProps['options'] => {
	return releaseVersions.map((releaseVersion: ReleaseVersion) => {
		const version = releaseVersion.version
		const isLatest = version === latestVersion
		return {
			label: `${version}${isLatest ? ' (latest)' : ''}`,
			value: version,
		}
	})
}

export const sortPlatforms = (releaseData: ReleaseVersion): SortedReleases => {
	// first we pull the platforms out of the release data object and format it the way we want
	const platforms = releaseData.builds.reduce((acc, build) => {
		if (!acc[build.os]) {
			acc[build.os] = {}
		}
		acc[build.os][build.arch] = build.url
		return acc
	}, {})

	const platformKeys = Object.keys(platforms)

	// create array of sorted values to base the order on
	const sortedValues = Object.keys(PLATFORM_MAP)
		.map((e) => PLATFORM_MAP[e])
		// join the lists together to make sure
		// all items are accounted for when sorting
		.concat(platformKeys)
		// filter our any duplicates and unneeded items
		.filter((elem, pos, arr) => {
			return arr.indexOf(elem) == pos && platformKeys.indexOf(elem) > -1
		})

	return (
		platformKeys
			// sort items based on PLATFORM_MAP order
			.sort((a, b) => {
				return sortedValues.indexOf(a) - sortedValues.indexOf(b)
			})
			// create new sorted object to return
			.reduce((result, key) => {
				result[key] = platforms[key]
				return result
			}, {})
	)
}

export function prettyOs(os: string): string {
	switch (os) {
		case 'darwin':
			return 'macOS'
		case 'freebsd':
			return 'FreeBSD'
		case 'openbsd':
			return 'OpenBSD'
		case 'netbsd':
			return 'NetBSD'
		case 'archlinux':
			return 'Arch Linux'
		case 'linux':
			return 'Linux'
		case 'windows':
			return 'Windows'
		default:
			return os.charAt(0).toUpperCase() + os.slice(1)
	}
}

export const sortAndFilterReleaseVersions = ({
	releaseVersions,
	isEnterpriseMode = false,
}: {
	releaseVersions: Record<string, ReleaseVersion>
	isEnterpriseMode: boolean
}): ReleaseVersion[] => {
	const filteredVersionStrings = Object.keys(releaseVersions).filter(
		(version: string) => {
			// Filter out invalid semver
			const isInvalidSemver = semverValid(version) == null
			if (isInvalidSemver) {
				return false
			}

			// Filter out prereleases
			const isPrelease = semverPrerelease(version) !== null
			if (isPrelease) {
				return false
			}

			// Filter in enterprise versions if enterprise mode
			const isEnterpriseVersion = !!version.match(/\+ent(?:.*?)*$/)
			if (isEnterpriseMode) {
				return isEnterpriseVersion
			}

			// Filter out enterprise versions if not enterprise mode
			return !isEnterpriseVersion
		}
	)
	const sortedVersionStrings = semverRSort(filteredVersionStrings)
	const sortedAndFilteredVersions = sortedVersionStrings.map(
		(version: string) => releaseVersions[version]
	)

	return sortedAndFilteredVersions
}

export const generateFeaturedCollectionsCards = async (
	featuredCollectionsSlugs: string[]
) => {
	// Gather collections based on slugs used
	const inlineCollections = await getInlineCollections(featuredCollectionsSlugs)

	// Format the data into collection card props objects
	return featuredCollectionsSlugs.map((slug: string) => {
		const formattedCollectionCard = formatCollectionCard(
			inlineCollections[slug]
		)
		return formattedCollectionCard
	})
}

/**
 * The `featuredTutorialsSlugs` array allows two formats of slugs:
 *   - <product slug>/<collection slug>/<tutorial slug>
 *   - <product slug>/<tutorial slug>
 */
export const generateFeaturedTutorialsCards = async (
	featuredTutorialsSlugs: string[]
) => {
	const splitTutorialSlug = (slug: string) => {
		const slugParts = slug.split('/')
		if (slugParts.length === 3) {
			// Slug format is: <product slug>/<collection slug>/<tutorial slug>
			return {
				productSlug: slugParts[0],
				collectionSlug: slugParts[1],
				tutorialSlug: slugParts[2],
			}
		} else if (slugParts.length === 2) {
			// Slug format is: <product slug>/<tutorial slug>
			return { productSlug: slugParts[0], tutorialSlug: slugParts[1] }
		} else {
			console.error(
				'Found string `featuredTutorialsSlugs` width incorrect number of slash-separated parts:',
				slug
			)
		}
	}

	/**
	 * Gather tutorials and collections based on slugs used
	 */
	const tutorialSlugs = featuredTutorialsSlugs.map((slug: string) => {
		const { productSlug, tutorialSlug } = splitTutorialSlug(slug)
		return `${productSlug}/${tutorialSlug}`
	})
	const inlineTutorials = await getInlineTutorials(tutorialSlugs)

	return featuredTutorialsSlugs.map((slug: string) => {
		const { productSlug, collectionSlug, tutorialSlug } =
			splitTutorialSlug(slug)
		const tutorialData = inlineTutorials[`${productSlug}/${tutorialSlug}`]

		/**
		 * We have full `Tutorial` data, but we need `TutorialLite` specifically,
		 * with a `defaultContext` property, to satisfy `formatTutorialCard`.
		 *
		 * Note: We could potentially change `TutorialLite` to maintain the
		 * `collectionCtx` property from `Tutorial`? This would remove the
		 * need to adapt data in this way, which we do in a few places
		 * for `formatTutorialCard`. Asana task:
		 * https://app.asana.com/0/1202097197789424/1202964504180140/f
		 */
		const defaultContext = tutorialData.collectionCtx.default
		const tutorialLiteCompat = { ...tutorialData, defaultContext }

		/**
		 * We have a collection context to use other than the default.
		 */
		let collectionContext = tutorialData.collectionCtx.default
		if (tutorialData.collectionCtx.default.slug != collectionSlug) {
			/**
			 * Note: if this ends up null, we'll end up falling back to
			 * `tutorialData.collectionCtx.default` in `formatTutorialCard`.
			 */
			collectionContext = tutorialData.collectionCtx.featuredIn?.find(
				(ctx: CollectionLite) => ctx.slug == collectionSlug
			)
		}

		/**
		 * Format for TutorialCard, using the specified collection context.
		 */
		const formattedTutorialCard = formatTutorialCard(
			tutorialLiteCompat,
			collectionContext
		)

		return {
			type: 'tutorial',
			...formattedTutorialCard,
		}
	})
}
