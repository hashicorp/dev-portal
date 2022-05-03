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
  actions: Array<{
    icon: ReactElement
    heading: string
    description: string
    link: string
  }>
}

export default function PreFooter({
  heading,
  description,
  actions,
}: PreFooterProps) {
  return (
    <section className={s.preFooter}>
      <div className={s.container}>
        <div className={s.content}>
          <Heading level={2} size={500} weight="bold" id={heading}>
            {heading}
          </Heading>
          <Text className={s.description}>{description}</Text>
        </div>

        <div className={s.actions}>
          <ul className={s.actionsList}>
            {actions.map((action) => {
              const slug = slugify(action.heading)
              return (
                <li className={s.actionsListItem} key={slug}>
                  <span className={s.actionsIcon}>{action.icon}</span>
                  <div>
                    <Heading
                      level={2}
                      size={300}
                      weight="bold"
                      id={slug}
                      className={s.actionsHeading}
                    >
                      {action.heading}
                    </Heading>
                    <StandaloneLink
                      color="secondary"
                      href={action.link}
                      icon={<IconExternalLink16 />}
                      iconPosition="trailing"
                      text={action.description}
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
