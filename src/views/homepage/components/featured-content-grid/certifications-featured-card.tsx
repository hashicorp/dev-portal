import Image from 'next/image'
import Heading from 'components/heading'
import Text from 'components/text'
import certificationsGraphic from '../../img/certifications-graphic.svg'
import FeaturedCard from './featured-card'
import s from './certifications-featured-card.module.css'

const CertificationsFeaturedCard = () => {
	const title = 'Get HashiCorp certified'

	return (
		<FeaturedCard
			className={s.certificationsCard}
			href="/certifications"
			title={title}
		>
			<div className={s.certificationsCardContent}>
				<Image
					alt=""
					className={s.certificationsGraphic}
					height={286}
					src={certificationsGraphic}
					width={373}
				/>
				<div className={s.certificationsCardContentText}>
					<Heading level={2} size={400} weight="bold">
						{title}
					</Heading>
					<Text asElement="p" size={300} weight="regular">
						Earn certifications to verify your skills and communicate your
						proficiency with HashiCorp multi-cloud products.
					</Text>
				</div>
			</div>
		</FeaturedCard>
	)
}

export default CertificationsFeaturedCard
