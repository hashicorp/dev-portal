import InlineSvg from '@hashicorp/react-inline-svg'
import Heading from 'components/heading'
import wafGraphic from '../../img/waf-graphic.svg?include'
import FeaturedCard from './featured-card'
import s from './waf-featured-card.module.css'

const WafFeaturedCard = () => {
	const title = 'What is HashiCorp’s Well-Architected Framework?'

	return (
		<FeaturedCard
			className={s.wafCard}
			href="/well-architected-framework"
			title={title}
		>
			<div className={s.wafCardContent}>
				<InlineSvg className={s.wafGraphic} src={wafGraphic} />
				<Heading level={2} size={400} weight="bold">
					{title}
				</Heading>
			</div>
		</FeaturedCard>
	)
}

export default WafFeaturedCard
