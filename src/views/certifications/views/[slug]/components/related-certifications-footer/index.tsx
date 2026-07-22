/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Heading from '@components/heading'
import Text from '@components/text'
import { CertificationCardDisplay } from 'views/certifications/components/certification-card'

// Styles
import s from './related-certifications-footer.module.css'

// Types
import { CertificationCardProps } from 'views/certifications/components/certification-card/types'
import { CertificationsMaxWidth } from 'views/certifications/components'

interface relatedCertificationsFooterProps {
	title: string
	desc: string
	relatedCertifications: CertificationCardProps[]
}

/**
 * This component is used to display a footer section with related certifications. It takes in a title, description, and an array of related certifications, and renders them in a structured layout.
 *
 * @param title - The title of the footer section.
 * @param desc - A brief description or subtitle for the footer section.
 * @param relatedCertifications - An array of JSON objects that will be displayed in the footer. Each object should contain the necessary properties to render a certification card, such as product, title, and ctaLink.
 *
 * @returns A React functional component that renders the related certifications footer.
 */
export function RelatedCertificationsFooter({
	title,
	desc,
	relatedCertifications,
}: relatedCertificationsFooterProps) {
	return (
		<footer className={s.relatedCertFooter}>
			<CertificationsMaxWidth>
				<div className={s.relatedCertFooterContainer}>
					<div className={s.relatedCertFooterHeader}>
						<Heading
							level={2}
							size={600}
							weight={'bold'}
							className={s.relatedCertFooterTitle}
						>
							{title}
						</Heading>
						<Text size={300} className={s.relatedCertFooterDesc}>
							{desc}
						</Text>
					</div>
					<div className={s.relatedCertFooterContent}>
						{relatedCertifications &&
							relatedCertifications.map((certification, index) => (
								<CertificationCardDisplay
									key={`related-certification-${index}`}
									isReduced={true}
									product={certification.product}
									title={certification.title}
									ctaLink={certification.ctaLink}
								/>
							))}
					</div>
				</div>
			</CertificationsMaxWidth>
		</footer>
	)
}
