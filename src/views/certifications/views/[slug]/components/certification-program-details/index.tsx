import { OverviewCard } from './components'
import {
	AccordionGroup,
	CertificationsContentArea,
} from 'views/certifications/components'
import s from './certification-program-details.module.css'

export function CertificationProgramDetails({ title }: { title: string }) {
	return (
		<>
			<div className={s.root}>
				<CertificationsContentArea>
					<div className={s.overviewCard}>
						<OverviewCard title={title} />
					</div>
					<h2 className={s.overviewHeading}>Overview header</h2>
					<div className={s.overviewFaq}>
						<AccordionGroup
							items={[
								{
									title: 'Prerequisites',
									content:
										'- Basic terminal skills\n- Basic understanding of on premises and cloud architecture',
								},
								{
									title: 'Exam experience',
									content:
										'Certification exams are taken online with a live proctor. This means that all locations and time zones are accommodated. Online proctoring provides the same benefits of a physical test center while being more accessible to exam-takers. The live proctor verifies the exam-taker’s identity, walks them through rules and procedures, and watches them take the exam. Be sure to follow the instructions on your exam appointment confirmation email about how to prepare your computer and physical environment to take the exam.',
								},
								{
									title: 'New disclosure',
									content:
										'Certification exams are taken online with a live proctor. This means that all locations and time zones are accommodated. Online proctoring provides the same benefits of a physical test center while being more accessible to exam-takers. The live proctor verifies the exam-taker’s identity, walks them through rules and procedures, and watches them take the exam. Be sure to follow the instructions on your exam appointment confirmation email about how to prepare your computer and physical environment to take the exam.',
								},
								{
									title: 'New disclosure (elevation high on hover)',
									content:
										'Certification exams are taken online with a live proctor. This means that all locations and time zones are accommodated. Online proctoring provides the same benefits of a physical test center while being more accessible to exam-takers. The live proctor verifies the exam-taker’s identity, walks them through rules and procedures, and watches them take the exam. Be sure to follow the instructions on your exam appointment confirmation email about how to prepare your computer and physical environment to take the exam.',
								},
							]}
						/>
					</div>
				</CertificationsContentArea>
			</div>
		</>
	)
}
