import { OverviewCtaProps } from './types'
import s from './overview-cta.module.css'

function OverviewCta({
  heading,
  headingSlug,
  body,
  cta,
  image,
}: OverviewCtaProps) {
  return (
    <>
      <pre className={s.placeholder}>
        <code>
          <h2 id={headingSlug} className={s.heading}>
            {heading} [id={headingSlug}]
          </h2>
          {JSON.stringify(
            { component: 'OverviewCta', heading, body, cta, image },
            null,
            2
          )}
        </code>
      </pre>
    </>
  )
}

export { OverviewCta }
export default OverviewCta
