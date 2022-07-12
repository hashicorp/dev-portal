import Card from 'components/card'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import ButtonLink from 'components/button-link'
import StandaloneLink from 'components/standalone-link'
import { GetStartedCardProps } from './types'
import s from './get-started-card.module.css'

function GetStartedCard({
  heading,
  headingSlug,
  body,
  ctas,
}: GetStartedCardProps) {
  return (
    <Card className={s.card}>
      <h2 id={headingSlug} className={s.heading}>
        {heading}
      </h2>
      <p className={s.body}>{body}</p>
      <div className={s.ctas}>
        {ctas.map((cta, idx) => {
          if (idx == 0) {
            // eslint-disable-next-line react/no-array-index-key
            return <ButtonLink key={idx} href={cta.url} text={cta.text} />
          } else {
            return (
              <StandaloneLink
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                href={cta.url}
                text={cta.text}
                icon={<IconArrowRight16 />}
                iconPosition="trailing"
              />
            )
          }
        })}
      </div>
    </Card>
  )
}

export { GetStartedCard }
export default GetStartedCard
