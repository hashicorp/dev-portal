/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
// import SectionWorkflowThatScales from 'components/_proxied-dot-io/waypoint/homepage/sections/workflow-that-scales'
import s from './home/style.module.css'

function HomePage(): JSX.Element {
	return (
		<div className={s.homePage}>
			<Hero
				heading={
					<>
						Easy application deployment for <em>Kubernetes</em> and{' '}
						<em>Amazon ECS</em>
					</>
				}
				description="Waypoint allows developers to deploy, manage, and observe their applications through a consistent abstraction of underlying infrastructure. Waypoint works with Kubernetes, ECS and many other platforms."
				link={{
					title: 'Get Started',
					url: 'https://developer.hashicorp.com/waypoint/tutorials/get-started-kubernetes',
				}}
			/>
			<SectionIntro
				columnLeft={{
					heading: (
						<>
							Simple <em>developer experience</em>
						</>
					),
					description:
						'Waypoint provides a simple and consistent abstraction for developers to easily build, deploy, and release applications.',
					features: [
						{
							icon: require('components/_proxied-dot-io/waypoint/homepage/icons/layers.svg?include'),
							heading: 'Application-centric abstraction',
							description:
								'Specify the deployment needs with a simple and consistent abstraction without the underlying complexity.',
						},
						{
							icon: require('components/_proxied-dot-io/waypoint/homepage/icons/link.svg?include'),
							heading: 'End-to-end deployment workflow',
							description:
								'Move and manage resources efficiently with distinct build, deploy, release steps.',
							link: {
								text: 'Learn more',
								url: 'https://www.waypointproject.io/docs/lifecycle',
							},
						},
					],
				}}
				columnRight={{
					heading: (
						<>
							Powerful for <em>operators</em>
						</>
					),
					description:
						'Waypoint enables operators to create PaaS workflows of Kubernetes, ECS, serverless applications.',
					features: [
						{
							icon: require('components/_proxied-dot-io/waypoint/homepage/icons/maximize.svg?include'),
							heading: 'Build-deploy-release extensibility',
							description:
								'Enable a pluggable framework, integrated with CI/CD pipelines, monitoring tools, and any other ecosystem tools.',
							link: {
								text: 'Learn more',
								url: 'https://www.waypointproject.io/docs/extending-waypoint',
							},
						},
						{
							icon: require('components/_proxied-dot-io/waypoint/homepage/icons/sidebar.svg?include'),
							heading: 'PaaS experience for developers',
							description:
								'Provide a consistent abstraction and unified workflow for any major platforms.',
						},
					],
				}}
			/>
			<SectionHowItWorks>
				<ConfigureYourApp
					heading="Configure your app for Waypoint"
					features={[
						{
							icon: require('components/_proxied-dot-io/waypoint/homepage/icons/edit-pencil.svg?include'),
							heading: 'Writing waypoint.hcl files',
							description:
								'Your waypoint.hcl file defines how Waypoint builds, deploys, and releases a project.',
						},
						{
							icon: require('components/_proxied-dot-io/waypoint/homepage/icons/layout.svg?include'),
							heading: 'Sample Waypoint files',
							description:
								'View sample waypoint.hcl files to see how straight-forward it is to configure your deployments',
						},
					]}
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
					codeNote="Configure your app for Waypoint in just a few lines"
				/>
				<BuildAndDeploy
					heading="Build and deploy"
					features={[
						{
							icon: require('components/_proxied-dot-io/waypoint/homepage/icons/file-plus.svg?include'),
							heading: 'Manage all steps within Waypoint',
							description:
								'Perform the build, deploy, and release steps for the app within waypoint. Or instrument your Waypoint deployments through Remote or Git operations.',
						},
					]}
				/>
				<MonitorAndManage
					heading="Manage your apps in one place"
					features={[
						{
							icon: require('components/_proxied-dot-io/waypoint/homepage/icons/sliders.svg?include'),
							heading: 'Rich GUI for Waypoint',
							description:
								'No matter where your developers are deploying to, view logs, builds, releases and even run exec commands from the Waypoint UI.',
						},
					]}
				/>
			</SectionHowItWorks>
			<SectionMonitorAppHealth
				heading="Monitor app health on any cloud"
				description="Waypoint provides real time status updates and monitoring for the entire lifecycle of your applications, no matter where you deploy to."
				features={[]}
			/>
			<SectionExtendPlugins
				heading="Extend Waypoint with plugins"
				description="Extend workflows via built-in plugins and an extensible interface. Supports custom builders, deployment platforms, registries, release managers, and more."
				features={[
					{
						icon: require('components/_proxied-dot-io/waypoint/homepage/icons/box.svg?include'),
						heading: 'Available plugins',
						description: 'View a list of existing HashiCorp maintained plugins',
						link: {
							url: '/plugins',
							text: 'Plugins',
						},
					},
					{
						icon: require('components/_proxied-dot-io/waypoint/homepage/icons/code-union.svg?include'),
						heading: 'Creating Waypoint plugins',
						description: 'Learn to extend Waypoint for your project’s needs',
						link: {
							url: '/docs/extending-waypoint/creating-plugins',
							text: 'Create',
						},
					},
				]}
			/>
			{/* <SectionWorkflowThatScales /> */}
			<SectionCallToAction
				features={[
					{
						media: {
							src: '/waypoint-public/img/prebuilt-binaries.svg',
							alt: '',
							width: 189,
							height: 44,
						},
						text: (
							<>
								Pre-built binaries available for{' '}
								<strong>macOS, Windows &amp; Linux</strong>
							</>
						),
					},
					{
						media: {
							src: '/waypoint-public/img/deploys-kubernetes-helm.svg',
							alt: '',
							width: 121,
							height: 44,
						},
						text: (
							<>
								Deploys to <strong>Kubernetes</strong> in seconds with&#160;
								<strong>Helm</strong>
							</>
						),
					},
					{
						media: {
							src: '/waypoint-public/img/first-party-aws-docker.svg',
							alt: '',
							width: 122,
							height: 42,
						},
						text: (
							<>
								First party support for{' '}
								<strong>AWS ECS, Docker, AWS Lambda</strong> and&#160;more
							</>
						),
					},
					{
						media: {
							src: '/waypoint-public/img/extensible-plugins.svg',
							alt: '',
							width: 65,
							height: 42,
						},
						text: <>Infinitely extensible with Waypoint&#160;plugins</>,
					},
				]}
				heading="Ready to get started?"
				content="Start by following a tutorial to deploy a simple application with Waypoint or learn about how the project works by exploring the documentation."
				links={[
					{
						text: 'Get Started',
						url: 'https://developer.hashicorp.com/waypoint/tutorials/get-started-kubernetes',
					},
					{ text: 'Explore Documentation', url: '/docs' },
				]}
			/>
		</div>
	)
}

export function getStaticProps() {
	// This function intentionally left blank to allow Next to use SSG.
	return { props: {} }
}

HomePage.layout = WaypointIoLayout
export default HomePage
