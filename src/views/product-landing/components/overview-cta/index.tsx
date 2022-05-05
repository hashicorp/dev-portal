import { OverviewCtaProps } from './types'
import isAbsoluteUrl from 'lib/is-absolute-url'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import s from './overview-cta.module.css'
import StandaloneLink from 'components/standalone-link'

function OverviewCta({
  heading,
  headingSlug,
  body,
  cta,
  image,
}: OverviewCtaProps) {
  return (
    <div className={s.root}>
      <div className={s.textPart}>
        <h2 id={headingSlug} className={s.heading}>
          {heading}
        </h2>
        <p className={s.body}>{body}</p>
        <StandaloneLink
          className={s.cta}
          text={cta.text}
          href={cta.url}
          color="secondary"
          icon={
            isAbsoluteUrl(cta.url) ? (
              <IconExternalLink16 />
            ) : (
              <IconArrowRight16 />
            )
          }
          iconPosition="trailing"
        />
      </div>
      <div className={s.imagePart}>
        <img src={image} alt="" />
      </div>
    </div>
  )
}

export { OverviewCta }
export default OverviewCta
