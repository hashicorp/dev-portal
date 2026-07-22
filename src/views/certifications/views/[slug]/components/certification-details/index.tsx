/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import {
	GradientCard,
	type GradientCardTheme,
} from 'views/certifications/components/gradient-card'
import Heading from '@components/heading'
import Text from '@components/text'

// Styles
import s from './certification-details.module.css'
import classNames from 'classnames'

// Types
import type { ExamDetail, CertificationDetailsProps } from './types'

// Components

/**
 * This component renders the top card of the certification details section. It displays a title and description about who should take the exam.
 *
 * @param product - The product name (e.g., 'terraform', 'vault') used to determine the theme of the gradient card.
 * @param title - The title of the card. Defaults to 'Who should take this exam'.
 * @param desc - The description text for the card.
 *
 * @returns JSX.Element
 */
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
		<GradientCard theme={product as GradientCardTheme}>
			<div className={s.certDetailsTopCard}>
				<Heading
					className={s.certDetailsTopCardTitle}
					level={2}
					size={500}
					weight={'bold'}
				>
					{title}
				</Heading>
				<Text
					className={classNames(s.certDetailsTopCardDesc, s.fontSize)}
					size={300}
				>
					{desc}
				</Text>
			</div>
		</GradientCard>
	)
}

/**
 * This component renders the bottom left card of the certification details section. It displays the exam details in a list format.
 *
 * @param product - The product name (e.g., 'terraform', 'vault') used to determine the theme of the gradient card.
 * @param title - The title of the card. Defaults to 'Exam Detail'.
 * @param examDetails - An array of exam detail objects, each containing a name and value.
 *
 * @returns JSX.Element
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
			<GradientCard theme={product as GradientCardTheme}>
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
								<Text size={300} weight={'semibold'} className={s.descTextSize}>
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

/**
 * This component renders the bottom right card of the certification details section. It displays the prerequisites in a list format.
 *
 * @param product - The product name (e.g., 'terraform', 'vault') used to determine the theme of the gradient card.
 * @param title - The title of the card. Defaults to 'Prerequisites'.
 * @param prereqs - An array of prerequisite strings.
 * @param bottomDesc - An optional description text displayed at the bottom of the card.
 *
 * @returns JSX.Element
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
			<GradientCard theme={product as GradientCardTheme}>
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
								<Text weight={'semibold'} className={s.descTextSize}>
									{prereq}
								</Text>
							</li>
						))}
					</ul>
					{bottomDesc && (
						<Text
							weight={'semibold'}
							className={classNames(
								s.certDetailsBottomRightCardBottomDesc,
								s.descTextSize,
							)}
						>
							{bottomDesc}
						</Text>
					)}
				</div>
			</GradientCard>
		</div>
	)
}

/**
 * This component renders the certification details section, which includes the top card (who should take this exam), the bottom left card (exam details), and the bottom right card (prerequisites).
 *
 * @param product - The product name (e.g., 'terraform', 'vault') used to determine the theme of the gradient cards.
 * @param data - An object containing the data for the certification details, including who should take the exam, exam details, and prerequisites.
 *
 * @returns JSX.Element
 */
export function CertificationDetails({
	product,
	data,
}: CertificationDetailsProps) {
	const whoExamData = data.whoShouldTakeExam
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
