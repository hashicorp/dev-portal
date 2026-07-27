/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
// Shared components
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import {
	Announcement,
	CertificationsMaxWidth,
	SignupFormArea,
	CertificationCardContainer,
	CertificationHero,
} from 'views/certifications/components'
// Local view
import { CertificationLandingProps } from './types'
import s from './landing.module.css'

function CertificationsLandingView({
	pageContent,
}: CertificationLandingProps) {
	const { hero } = pageContent

	const terraformCertData = [
		{
			product: 'terraform',
			title: 'Terraform Associate',
			desc: 'Brief description to gives the user enough context to take the next step with confidence',
			starCount: 1,
			ctaLink: 'certifications/infrastructure-automation',
			certDetails: [
				'Product version tested: Terraform 1.12',
				'Terraform basic concepts and skills',
				'Terraform Associate value proposition',
			],
		},
		{
			product: 'terraform',
			title: 'Terraform Authoring and Operations Professional',
			desc: 'Brief description to gives the user enough context to take the next step with confidence',
			starCount: 3,
			ctaLink: 'certifications/infrastructure-automation',
			certDetails: [
				'Product version tested: Terraform 1.12',
				'Terraform advanced concepts and skills',
				'Terraform Professional value proposition',
			],
		},
	]

	const vaultCertData = [
		{
			product: 'vault',
			title: 'Vault Associate',
			desc: 'Brief description to gives the user enough context to take the next step with confidence',
			starCount: 1,
			ctaLink: 'certifications/security-automation',
			certDetails: [
				'Product version tested: Vault 1.12',
				'Vault basic concepts and skills',
				'Vault Associate value proposition',
			],
		},
		{
			product: 'vault',
			title: 'Vault Operations Professional',
			desc: 'Brief description to gives the user enough context to take the next step with confidence',
			starCount: 3,
			ctaLink: 'certifications/security-automation',
			certDetails: [
				'Product version tested: Vault 1.12',
				'Vault advanced concepts and skills',
				'Vault Professional value proposition',
			],
		},
	]

	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<div className={s.root}>
				{/* Hero */}
				<CertificationHero
					heading={hero.heading}
					description={hero.description}
				/>
				<CertificationsMaxWidth>
					<Announcement
						heading="TechXchange is Coming"
						text="Learn from certified instructors on how to boost your enterprise adoption of HashiCorp"
						cta="Read more"
						ctaLink="https://developer.hashicorp.com"
					/>
					<CertificationCardContainer
						product="Terraform"
						containerDesc="We offer Terraform certifications at two levels. Earn the Terraform Associate certification to validate your foundational Terraform knowledge and skills. Demonstrate your advanced Terraform production experience with the Terraform Authoring and Operations Professional certification."
						certData={terraformCertData}
					/>
					<CertificationCardContainer
						product="Vault"
						containerDesc="Earn an associate-level certification to validate your foundational Vault or Consul knowledge and skills. You can also demonstrate your advanced Vault operational experience when you pass the Vault Operations Professional exam."
						certData={vaultCertData}
					/>
					<div className={s.signupForm}>
						<SignupFormArea />
					</div>
				</CertificationsMaxWidth>
			</div>
		</BaseLayout>
	)
}

export default CertificationsLandingView
