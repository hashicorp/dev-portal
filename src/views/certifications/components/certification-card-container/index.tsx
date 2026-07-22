/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Heading from '@components/heading'
import Text from '@components/text'
import { CertificationCardDisplay } from 'views/certifications/components/certification-card'

// Styles
import s from './certification-card-container.module.css'

// Types
import { CertificationCardProps } from 'views/certifications/components/certification-card/types'

interface CertificationCardContainerProps {
	product: string
	containerDesc: string
	certData: CertificationCardProps[]
}

const MAX_NUM_CERTIFICATIONS = 2
/* 
    Things to note:
    1a. Need to insert a product icon here based on the product name
	1b. Found how the icons are being rendered: https://github.com/hashicorp/dev-portal/blob/main/src/views/certifications/components/exam-badge/index.tsx#L34
*/

/**
 * This component is used to display a container for certification cards. It takes in a product name, a description for the container, and an array of certification card data. The component will render a maximum of MAX_NUM_CERTIFICATIONS certification cards.
 *
 * @param product - The name of the product for which the certifications are being displayed.
 * @param containerDesc - A description for the certification card container.
 * @param certData - An array of certification card data. Each item in the array should be a JSON object that contains the properties defined in the CertificationCardProps interface.
 *
 * @returns A JSX element that represents the certification card container with the specified product name, description, and certification cards.
 */
export function CertificationCardContainer({
	product,
	containerDesc,
	certData,
}: CertificationCardContainerProps) {
	certData = certData.slice(0, MAX_NUM_CERTIFICATIONS) // Limit the number of certifications displayed to MAX_NUM_CERTIFICATIONS

	return (
		<div className={s.certCardContainer}>
			<div className={s.certCardContainerHeader}>
				<div className={s.certCardContainerTitle}>
					{/* Insert a product icon here based on the product name */}
					{'Icon'}
					<Heading
						className={s.certCardContainerTitleText}
						level={2}
						size={600}
						weight={'bold'}
					>
						{product}
					</Heading>
				</div>
				<Text
					className={s.certCardContainerHeaderDesc}
					size={300}
					weight={'medium'}
				>
					{containerDesc}
				</Text>
			</div>
			<div className={s.certCardContainerContent}>
				{certData &&
					certData.map((cert, index) => (
						<CertificationCardDisplay
							key={`certCard-${index}`}
							product={cert.product}
							title={cert.title}
							desc={cert.desc ? cert.desc : ''}
							starCount={cert.starCount ? cert.starCount : 0}
							cta={cert?.cta}
							ctaLink={cert.ctaLink}
							certDetails={cert.certDetails ? cert.certDetails : []}
						/>
					))}
			</div>
		</div>
	)
}
