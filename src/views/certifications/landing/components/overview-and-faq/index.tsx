import Disclosure, {
	DisclosureActivator,
	DisclosureContent,
} from 'components/disclosure'
import { CertificationsContentArea } from 'views/certifications/components'
import s from './overview-and-faq.module.css'

interface Faq {
	title: string
	content: string
}

interface OverviewAndFaqProps {
	heading: string
	faqs: Faq[]
}

export function OverviewAndFaq({ heading, faqs }: OverviewAndFaqProps) {
	return (
		<>
			<div className={s.root}>
				<CertificationsContentArea>
					<h2>{heading}</h2>
					{faqs.map(({ title, content }: Faq) => {
						return (
							<Disclosure key="title">
								<DisclosureActivator>{title}</DisclosureActivator>
								<DisclosureContent>{content}</DisclosureContent>
							</Disclosure>
						)
					})}
				</CertificationsContentArea>
			</div>
		</>
	)
}
