import { GetStartedCardProps } from './types'
import s from './get-started-card.module.css'

function GetStartedCard({
  heading,
  headingSlug,
  body,
  ctas,
}: GetStartedCardProps) {
  return (
    <>
      <pre className={s.placeholder}>
        <code>
          <h2 id={headingSlug} className={s.heading}>
            {heading} [id={headingSlug}]
          </h2>
          {JSON.stringify(
            { component: 'GetStartedCard', heading, body, ctas },
            null,
            2
          )}
        </code>
      </pre>
    </>
  )
}

export { GetStartedCard }
export default GetStartedCard
