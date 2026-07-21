// Components
import { GradientCard } from 'views/certifications/components/gradient-card'
import Heading from '@components/heading'
import Text from '@components/text'

// Styles
import s from './certification-details.module.css'

// Types
import type { ExamDetail, CertificationDetailsProps } from './types'

// Components
// Product is used to determine the theme of the gradient card
function CertificationDetailsTopCard({
	product,
	title = 'Who should take this exam',
	desc,
}: {
	product: string
	title?: string
	desc: string
}) {
	return (
		<GradientCard theme={'infrastructure-automation'}>
			<div className={s.certDetailsTopCard}>
				<Heading
					className={s.certDetailsTopCardTitle}
					level={2}
					size={500}
					weight={'bold'}
				>
					{title}
				</Heading>
				<Text className={s.certDetailsTopCardDesc} size={300}>
					{desc}
				</Text>
			</div>
		</GradientCard>
	)
}

function CertificationDetailsBottomLeftCard({
    product,
	title = 'Exam Detail',
	examDetails,
}: {
    product: string
	title?: string
	examDetails: ExamDetail[]
}) {
	return <div></div>
}

function CertificationDetailsBottomRightCard({
    product,
	title = 'Prerequisites',
	prereqs,
	bottomDesc,
}: {
    product: string
	title?: string
	prereqs: string[]
	bottomDesc?: string
}) {
	return <div></div>
}

/* 
    1. Handle data pass in and breakdown
    2. Figure out how to handle the product theme for the gradient card
*/

export function CertificationDetails({
	product,
	data,
}: CertificationDetailsProps) {
	const whoExamData = data.who
	const examData = data.examDetails
	const prereqData = data.prerequisites

	return (
		<div className={s.certDetails}>
			<CertificationDetailsTopCard
				product={product}
				title={whoExamData?.title}
				desc={whoExamData.desc}
			/>
			<div className={s.certDetailsBottom}>
				<CertificationDetailsBottomLeftCard
					product={product}
					title={examData?.title}
					examDetails={examData.details}
				/>
				<CertificationDetailsBottomRightCard
					product={product}
					title={prereqData?.title}
					prereqs={prereqData.prereqs}
					bottomDesc={prereqData?.bottomDesc}
				/>
			</div>
		</div>
	)
}
