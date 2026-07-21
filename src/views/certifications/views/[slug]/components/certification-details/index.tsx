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

/* 
    1. Check styling - I have margins on the bottom of each exam detail besides the last one
    2. Figure out how to add the horizontal gap between each exam detail (32px)
*/
function CertificationDetailsBottomLeftCard({
	product,
	title = 'Exam Detail',
	examDetails,
}: {
	product: string
	title?: string
	examDetails: ExamDetail[]
}) {
	return (
		<div className={s.certDetailsBottomLeftCard}>
			<GradientCard theme={'infrastructure-automation'}>
				<div className={s.certDetailsBottomLeftCardContents}>
					<Heading
						className={s.certDetailsBottomLeftCardTitle}
						level={2}
						size={500}
						weight={'bold'}
					>
						{title}
					</Heading>
					<ul className={s.certDetailsBottomLeftCardList}>
						{examDetails.map((detail, index) => (
							<li
								key={`exam-detail-${index}`}
								className={s.certDetailsBottomLeftCardListItem}
							>
								<Heading
									level={3}
									size={200}
									weight={'medium'}
									className={s.certDetailsBottomLeftCardListItemTitle}
								>
									{detail.name}
								</Heading>
								<Text
									size={300}
									weight={'semibold'}
									className={s.certDetailsBottomLeftCardListItemDesc}
								>
									{detail.value}
								</Text>
							</li>
						))}
					</ul>
				</div>
			</GradientCard>
		</div>
	)
}

/* 
    1. Check styling - Margin left found on the list of prereqs
    2. Confirm the text coloring
*/
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
	return (
		<div className={s.certDetailsBottomRightCard}>
			<GradientCard theme={'infrastructure-automation'}>
				<div className={s.certDetailsBottomRightCardContents}>
					<Heading
						className={s.certDetailsBottomRightCardTitle}
						level={2}
						size={600}
						weight={'bold'}
					>
						{title}
					</Heading>
					<ul className={s.certDetailsBottomRightCardList}>
						{prereqs.map((prereq, index) => (
							<li
								key={`prereq-${index}`}
								className={s.certDetailsBottomRightCardListItem}
							>
								<Text size={300}>{prereq}</Text>
							</li>
						))}
					</ul>
					{bottomDesc && (
						<p className={s.certDetailsBottomRightCardBottomDesc}>
							{bottomDesc}
						</p>
					)}
				</div>
			</GradientCard>
		</div>
	)
}

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
