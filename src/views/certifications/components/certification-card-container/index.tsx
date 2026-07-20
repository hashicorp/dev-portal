// Components
import Heading from '@components/heading'
import Text from '@components/text'
import { CertificationCardDisplay } from '../certification-card'

// Styles
import s from './certification-card-container.module.css'

// Types
import { CertificationCardProps } from '../certification-card/types'

interface CertificationCardContainerProps {
	product: string
	containerDesc: string
	certData: CertificationCardProps[]
}
/* 
    Things to note:
    1. Might want to restrict the number of certification cards to n cards (e.g. n = 2)
    2a. Need to insert a product icon here based on the product name
	2b. Found how the icons are being rendered: https://github.com/hashicorp/dev-portal/blob/main/src/views/certifications/components/exam-badge/index.tsx#L34
    3. Determine how much space is needed for section of the container
    4. Address turning the product name into Title case when fed as a lowercase string
    5. MAX WIDTH ON CERTIFICATION CARDS LEAVES SOME EXTRA SPACE ON TABLET/MOBILE VIEWS; Might want to consider removing.
*/
export function CertificationCardContainer({
	product,
	containerDesc,
	certData,
}: CertificationCardContainerProps) {
	return (
		<div className={s.certCardContainer}>
			<div className={s.certCardContainerHeader}>
				<div className={s.certCardContainerTitle}>
					{/* Insert a product icon here based on the product name */}
                    {"Icon"}
					<Heading className={s.certCardContainerTitleText} level={2} size={600} weight={'bold'}>
						{product}
					</Heading>
				</div>
				<Text className={s.certCardContainerHeaderDesc} size={300} weight={'medium'}>{containerDesc}</Text>
			</div>
			<div className={s.certCardContainerContent}>
				{certData &&
					certData.map((cert, index) => (
						<CertificationCardDisplay
							key={`certCard-${index}`}
							isReduced={cert.isReduced ? cert.isReduced : false}
							product={cert.product}
							title={cert.title}
							desc={cert.desc ? cert.desc : ''}
							starCount={cert.starCount ? cert.starCount : 0}
							cta={cert.cta ? cert.cta : 'Learn more'}
							ctaLink={cert.ctaLink}
							certDetails={cert.certDetails ? cert.certDetails : []}
						/>
					))}
			</div>
		</div>
	)
}
