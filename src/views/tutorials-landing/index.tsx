import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import BaseNewLayout from 'layouts/base-new'
import { GlobalThemeOption } from 'styles/themes/types'
import StandaloneLink from 'components/standalone-link'
import s from './tutorials-landing.module.css'

const TITLE = 'Start here'
const SUBTITLE =
	'Brief intro - this is our opportunity to shape the value of this page for our Beginner practitioners. Max character count of 150 would be ideal.  Discover step-by-step learning paths to help you complete essential task to get started with HashiCorp products.'

const TutorialsLandingView = () => {
	return (
		<div className={s.root}>
			<div className={s.hero}>
				<header className={s.header}>
					<h1 className={s.title}>{TITLE}</h1>
					<p className={s.subtitle}>{SUBTITLE}</p>
				</header>
			</div>
			{new Array(10).fill(null).map((_, index: number) => {
				return (
					// eslint-disable-next-line react/no-array-index-key
					<section className={s.section} key={index}>
						<div className={s.leftRight}>
							<div className={s.left}>
								<h2 className={s.sectionTitle}>Product {index + 1}</h2>
								<p className={s.sectionDescription}>
									Brief product description: Learn how to provision, change, and
									version resources on any environment. Set expectations
								</p>
								<h3 className={s.featuredUseCasesTitle}>Featured use cases</h3>
								<ul className={s.featuredUseCasesList}>
									{new Array(3).fill(null).map((_, index) => {
										return (
											// eslint-disable-next-line react/no-array-index-key
											<li key={index}>
												<StandaloneLink
													color="secondary"
													href="#"
													icon={<IconArrowRight24 />}
													iconPosition="trailing"
													size="large"
													text={`Featured use case #${index + 1}`}
												/>
											</li>
										)
									})}
								</ul>
							</div>
							<div className={s.right}>
								<div className={s.grid}>
									{new Array(3).fill(null).map((text: string) => {
										return (
											<div className={s.card} key={text}>
												<div className={s.cardHeader}>{/* TODO */}</div>
												<div className={s.cardBody}>{/* TODO */}</div>
											</div>
										)
									})}
								</div>
							</div>
						</div>
					</section>
				)
			})}
		</div>
	)
}

TutorialsLandingView.contentType = 'tutorials'
TutorialsLandingView.layout = BaseNewLayout
TutorialsLandingView.theme = GlobalThemeOption.light

export default TutorialsLandingView
