import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import {
	generateStaticProps,
	ReleasesAPIResponse,
} from 'lib/fetch-release-data'
import styles from './style.module.css'

function WaypointDownloadsPage({
	latestVersion,
	releases,
}: {
	latestVersion: string
	releases: ReleasesAPIResponse
}) {
	const getStartedDescription =
		'Follow step-by-step tutorials on AWS, Azure, GCP, and localhost.'
	const getStartedLinks = [
		{
			label: 'Deploy to Docker',
			href: 'https://developer.hashicorp.com/waypoint/tutorials/get-started-docker',
		},
		{
			label: 'Deploy to Kubernetes',
			href: 'https://developer.hashicorp.com/waypoint/tutorials/get-started-kubernetes',
		},
		{
			label: 'Deploy to AWS',
			href: 'https://developer.hashicorp.com/waypoint/tutorials/deploy-aws',
		},
		{
			label: 'View all Waypoint tutorials',
			href: 'https://developer.hashicorp.com/waypoint/tutorials',
		},
	]
	const logo = ( // eslint-disable-next-line @next/next/no-img-element
		<img
			className={styles.logo}
			alt="Waypoint"
			src={require('./img/waypoint-logo.svg')}
		/>
	)
	const tutorialLink = {
		href: 'https://developer.hashicorp.com/waypoint/tutorials',
		label: 'View Tutorials',
	}

	return (
		<ProductDownloadsPage
			getStartedDescription={getStartedDescription}
			getStartedLinks={getStartedLinks}
			latestVersion={latestVersion}
			logo={logo}
			product="waypoint"
			releases={releases}
			tutorialLink={tutorialLink}
		/>
	)
}

export const getStaticProps = () => generateStaticProps('waypoint')

WaypointDownloadsPage.layout = WaypointIoLayout
export default WaypointDownloadsPage
