/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement, useMemo } from 'react'

// Global imports
import { productSlugs } from 'lib/products'
import BaseNewLayout from 'layouts/base-new'
import Text from 'components/text'
import { GlobalThemeOption } from 'styles/themes/types'

// Local imports
import { HomePageProps, HomePageContentProps } from './types'
import PreFooter from './components/pre-footer'
import ProductNav from './components/product-nav'
import MerchandisingSlots from './components/merchandising-slots'
import { HeroWithVideo } from './components/hero'
import { HcpSlot, VaultSlot } from './components/merchandising-slots/slots'
import { CertificationsSection } from './components/certifications-section'
import s from './homepage.module.css'
import Card from 'components/card'

const VIDEO_URL = 'https://hashicorp.wistia.com/medias/m17a0rrzj1'
const VIDEO_THUMBNAIL_URL =
	'https://embed-ssl.wistia.com/deliveries/86999d82bb41a2c3674f0ebb6f4b55ad442d556c.jpg?image_crop_resized=960x560'

const HomePageContent = ({
	hero,
	merchandising,
	certificationsSection,
	preFooter,
	navNotice,
}: HomePageContentProps) => {
	const products = useMemo(
		() =>
			productSlugs
				.filter((slug) => slug !== 'sentinel')
				.map((slug) => ({
					slug,
				})),
		[]
	)

	return (
		<div className={s.homepageContent}>
			<HeroWithVideo
				heading={hero.heading}
				description={<Text>{hero.description}</Text>}
				videoUrl={VIDEO_URL}
				videoImageUrl={VIDEO_THUMBNAIL_URL}
			/>
			<ProductNav notice={navNotice} products={products} />
			<MerchandisingSlots>
				<VaultSlot
					url={merchandising.vault.url}
					cardTitle={merchandising.vault.cardTitle}
					description={merchandising.vault.description}
					ctaText={merchandising.vault.ctaText}
				/>
				<HcpSlot
					url={merchandising.hcp.url}
					cardTitle={merchandising.hcp.cardTitle}
					description={merchandising.hcp.description}
					ctaText={merchandising.hcp.ctaText}
				/>
			</MerchandisingSlots>
			<CertificationsSection
				heading={certificationsSection.heading}
				description={certificationsSection.description}
				collectionCards={certificationsSection.collectionCards}
				link={certificationsSection.link}
			/>
			<PreFooter
				heading={preFooter.heading}
				description={preFooter.description}
				actions={preFooter.actions}
			/>
		</div>
	)
}

const HOME_PAGE_REDESIGN_ENABLED = __config.flags.enable_home_page_redesign

function HomePageView({ content }: HomePageProps): ReactElement {
	if (HOME_PAGE_REDESIGN_ENABLED) {
		return (
			<div
				style={{
					maxWidth: 1240,
					margin: '0 auto',
				}}
			>
				<header style={{ marginBottom: 78, marginTop: 148 }}>
					<h1
						style={{
							fontSize: 70,
							fontWeight: 700,
							marginTop: 0,
							marginBottom: 10,
							width: 'fit-content',
							lineHeight: '84px',
						}}
					>
						Step inside.
					</h1>
					<p
						style={{
							fontSize: 70,
							fontWeight: 600,
							marginTop: 0,
							marginBottom: 0,
							width: 'fit-content',
							lineHeight: '84px',
						}}
					>
						Define your path.
					</p>
				</header>
				<div className={s.chicletNav}>
					<p
						style={{
							fontWeight: 500,
							fontSize: 13,
							lineHeight: '18px',
							marginBottom: 24,
						}}
					>
						Explore by product
					</p>
					<nav>
						<ul>
							<li>
								<a href="/hcp">
									<img alt="" src="https://placekitten.com/g/22/22" />
									HCP
								</a>
							</li>
							<li>
								<a href="/packer">
									<img alt="" src="https://placekitten.com/g/22/22" />
									Packer
								</a>
							</li>
							<li>
								<a href="/terraform">
									<img alt="" src="https://placekitten.com/g/22/22" />
									Terraform
								</a>
							</li>
							<li>
								<a href="/consul">
									<img alt="" src="https://placekitten.com/g/22/22" />
									Consul
								</a>
							</li>
							<li>
								<a href="/boundary">
									<img alt="" src="https://placekitten.com/g/22/22" />
									Boundary
								</a>
							</li>
							<li>
								<a href="/vault">
									<img alt="" src="https://placekitten.com/g/22/22" />
									Vault
								</a>
							</li>
							<li>
								<a href="/nomad">
									<img alt="" src="https://placekitten.com/g/22/22" />
									Nomad
								</a>
							</li>
							<li>
								<a href="/waypoint">
									<img alt="" src="https://placekitten.com/g/22/22" />
									Waypoint
								</a>
							</li>
							<li>
								<a href="/vagrant">
									<img alt="" src="https://placekitten.com/g/22/22" />
									Vagrant
								</a>
							</li>
						</ul>
					</nav>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateAreas: `
"b a a"
"b c d"
`,
						columnGap: 40,
						rowGap: 32,
						marginBottom: 227,
						gridTemplateRows: 'repeat(2, 1fr)',
						gridTemplateColumns: 'repeat(3, 1fr)',
					}}
				>
					<div style={{ gridArea: 'a' }}>
						<Card className={s.card}>
							<div>
								<h2>Solution central...</h2>
								<p>
									Let our enhanced search do the heavy lifting to put you on the
									right path
								</p>
							</div>
						</Card>
					</div>
					<div style={{ gridArea: 'b', paddingTop: 66 }}>
						<Card className={s.card}>
							<img alt="" src="https://placekitten.com/g/373/286" />
							<h2>Get HashiCorp certified</h2>
							<p>
								Earn certifications to verify your skills and communicate your
								proficiency with HashiCorp multi-cloud products.
							</p>
							<p>Learn more</p>
						</Card>
					</div>
					<div style={{ gridArea: 'c' }}>
						<Card className={s.card}>
							<h2>HashiCorp Cloud Platform</h2>
							<p>
								The fastest way to get up and running with HashiCorp products
							</p>
							<p>Learn more</p>
						</Card>
					</div>
					<div style={{ gridArea: 'd' }}>
						<Card className={s.card}>
							<img alt="" src="https://placekitten.com/g/320/185" />
							<h2>What is HashiCorp’s Well-Architected Framework?</h2>
							<p>Learn more</p>
						</Card>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={s.homepage}>
			<HomePageContent {...content} />
		</div>
	)
}

HomePageView.layout = BaseNewLayout
HomePageView.theme = GlobalThemeOption.light

export default HomePageView
