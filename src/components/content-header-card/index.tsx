import Card from 'components/card'
import s from './content-header-card.module.css'

export default function ContentHeaderCard() {
	return (
		<Card elevation="base" className={s.contentHeaderCard}>
			<div className={s.cardTop}></div>
			<div className={s.cardBottom}></div>
		</Card>
	)
}
