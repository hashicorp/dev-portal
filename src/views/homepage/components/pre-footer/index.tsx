import { ReactElement } from 'react'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import slugify from 'slugify'
import Heading from 'components/heading'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import s from './pre-footer.module.css'

interface PreFooterProps {
  heading: string
  description: string
  ctas: Array<{
    icon: ReactElement
    heading: string
    description: string
    link: string
  }>
}

export default function PreFooter({
  heading,
  description,
  ctas,
}: PreFooterProps) {
  return (
    <section className={s.preFooter}>
      <div className={s.container}>
        <div className={s.content}>
          <Heading level={2} size={500} weight="bold" slug={heading}>
            {heading}
          </Heading>
          <Text className={s.description}>{description}</Text>
        </div>

        <div className={s.actions}>
          <ul className={s.ctaList}>
            {ctas.map((cta) => {
              const slug = slugify(cta.heading)
              return (
                <li className={s.ctaItem} key={slug}>
                  <span className={s.ctaIcon}>{cta.icon}</span>
                  <div>
                    <Heading
                      level={2}
                      size={300}
                      weight="bold"
                      slug={slug}
                      className={s.ctaHeading}
                    >
                      {cta.heading}
                    </Heading>
                    <StandaloneLink
                      color="secondary"
                      href={cta.link}
                      icon={<IconExternalLink16 />}
                      iconPosition="trailing"
                      text={cta.description}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
