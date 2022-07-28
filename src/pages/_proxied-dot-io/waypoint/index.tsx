import HashiHead from '@hashicorp/react-head'
import { proxiedRivetClient } from 'lib/cms'
import homepageQuery from './query.graphql'
import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import Hero from 'components/_proxied-dot-io/waypoint/homepage/hero'
import SectionIntro from 'components/_proxied-dot-io/waypoint/homepage/sections/intro'
import SectionHowItWorks from 'components/_proxied-dot-io/waypoint/homepage/sections/how-it-works'
import ConfigureYourApp from 'components/_proxied-dot-io/waypoint/homepage/sections/how-it-works/configure-your-app'
import BuildAndDeploy from 'components/_proxied-dot-io/waypoint/homepage/sections/how-it-works/build-and-deploy'
import MonitorAndManage from 'components/_proxied-dot-io/waypoint/homepage/sections/how-it-works/monitor-and-manage'
import SectionMonitorAppHealth from 'components/_proxied-dot-io/waypoint/homepage/sections/monitor-app-health'
import SectionExtendPlugins from 'components/_proxied-dot-io/waypoint/homepage/sections/extend-plugins'
import SectionCallToAction from 'components/_proxied-dot-io/waypoint/homepage/sections/call-to-action'
import s from './home/style.module.css'

function HomePage({ data }): JSX.Element {
	const {
		seo,
		hero,
		intro,
		configureYourAppSection,
		buildAndDeploySection,
		monitorYourAppSection,
		monitorAppHealthSection,
		extendPluginsSection,
		callToActionSection,
	} = data

	return (
		<>
			<HashiHead
				title={seo.title}
				description={seo.description}
				image={seo.image?.url}
			/>

			<div className={s.homePage}>
				<Hero
					heading={hero.heading}
					description={hero.description}
					link={hero.cta}
				/>

				<SectionIntro
					columnLeft={intro.leftColumn}
					columnRight={intro.rightColumn}
				/>

				<SectionHowItWorks>
					<ConfigureYourApp
						heading={configureYourAppSection.heading}
						features={configureYourAppSection.features}
						code={`<span class="token keyword">build</span> {
  use <span class="token string">"pack"</span> {}
  <span class="token keyword">registry</span> {
    use <span class="token string">"docker"</span> {
      <span class="token keyword">image</span> = <span class="token string">"nodejs-example"</span>
      <span class="token keyword">tag</span>   = <span class="token string">"latest"</span>
      <span class="token keyword">local</span> = <span class="token boolean">true</span>
    }
  }
}
<span class="token keyword">deploy</span> {
  use <span class="token string">"helm"</span> {
    <span class="token keyword">chart</span> = "\${<span class="token keyword">path</span>.app}<span class="token string">/chart</span>"
    <span class="token keyword">set</span> {
      <span class="token keyword">name</span>  = <span class="token string">"deployment.image"</span>
      <span class="token keyword">value</span> = artifact.name
    }
  }
}`}
						codeNote={configureYourAppSection.codeNote}
					/>

					<BuildAndDeploy
						heading={buildAndDeploySection.heading}
						features={buildAndDeploySection.features}
					/>

					<MonitorAndManage
						heading={monitorYourAppSection.heading}
						features={monitorYourAppSection.features}
					/>
				</SectionHowItWorks>

				<SectionMonitorAppHealth
					heading={monitorAppHealthSection.heading}
					description={monitorAppHealthSection.description}
				/>

				<SectionExtendPlugins
					heading={extendPluginsSection.heading}
					description={extendPluginsSection.description}
					features={extendPluginsSection.features}
				/>

				<SectionCallToAction
					heading={callToActionSection.heading}
					content={callToActionSection.content}
					features={callToActionSection.features}
					links={callToActionSection.links}
				/>
			</div>
		</>
	)
}

export async function getStaticProps() {
	const query = proxiedRivetClient('waypoint')
	const { waypointHomepageCurrent } = await query({
		query: homepageQuery,
	})

	const {
		seo,
		heroHeading,
		heroDescription,
		heroCta,
		introLeftColumnHeading,
		introLeftColumnDescription,
		introLeftColumnFeatures,
		introRightColumnHeading,
		introRightColumnDescription,
		introRightColumnFeatures,
		configureYourAppHeading,
		configureYourAppCodeNote,
		configureYourAppFeatures,
		buildAndDeployHeading,
		buildAndDeployFeatures,
		monitorYourAppHeading,
		monitorYourAppFeatures,
		monitorAppHealthHeading,
		monitorAppHealthDescription,
		extendPluginsHeading,
		extendPluginsDescription,
		extendPluginsFeatures,
		callToActionHeading,
		callToActionContent,
		callToActionFeatures,
		callToActionLinks,
	} = waypointHomepageCurrent

	const pageData = {
		seo,
		hero: {
			heading: heroHeading,
			description: heroDescription,
			cta: heroCta[0],
		},
		intro: {
			leftColumn: {
				heading: introLeftColumnHeading,
				description: introLeftColumnDescription,
				features: formatFeatures(introLeftColumnFeatures),
			},
			rightColumn: {
				heading: introRightColumnHeading,
				description: introRightColumnDescription,
				features: formatFeatures(introRightColumnFeatures),
			},
		},
		configureYourAppSection: {
			heading: configureYourAppHeading,
			codeNote: configureYourAppCodeNote,
			features: formatFeatures(configureYourAppFeatures),
		},
		buildAndDeploySection: {
			heading: buildAndDeployHeading,
			features: formatFeatures(buildAndDeployFeatures),
		},
		monitorYourAppSection: {
			heading: monitorYourAppHeading,
			features: formatFeatures(monitorYourAppFeatures),
		},
		monitorAppHealthSection: {
			heading: monitorAppHealthHeading,
			description: monitorAppHealthDescription,
		},
		extendPluginsSection: {
			heading: extendPluginsHeading,
			description: extendPluginsDescription,
			features: formatFeatures(extendPluginsFeatures),
		},
		callToActionSection: {
			heading: callToActionHeading,
			content: callToActionContent,
			features: callToActionFeatures,
			links: callToActionLinks,
		},
	}

	return {
		props: {
			data: pageData,
		},
		revalidate: __config.io_sites.revalidate,
	}
}

HomePage.layout = WaypointIoLayout

export default HomePage

function formatFeatures(features) {
	const formattedFeatures = features.map((feature) => {
		return {
			icon: feature.icon,
			heading: feature.heading,
			description: feature.description,
			...(feature.link.length > 0
				? {
						link: feature.link[0],
				  }
				: {}),
		}
	})
	return formattedFeatures
}
