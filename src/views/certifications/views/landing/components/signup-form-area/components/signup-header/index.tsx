import Text from 'components/text'
import Heading from 'components/heading'
import s from './signup-header.module.css'

export default function SignupHeader() {
	return (
		<div className={s.header}>
			<Heading className={s.heading} level={2} size={500} weight="bold">
				Stay Informed
			</Heading>
			<Text size={200}>
				Sign up to be notified with updates to the HashiCorp Product
				Certifications program and to receive news and information about
				HashiCorp products.
			</Text>
		</div>
	)
}
