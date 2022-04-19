import { ReactElement } from 'react'
import Button from '@hashicorp/react-button'
import Card from 'components/card'
import { UseCaseCardProps } from './types'
import s from './style.module.css'

function UseCaseCard({ heading, body, links }: UseCaseCardProps): ReactElement {
  return (
    <Card>
      <article>
        <h1 className={s.heading}>{heading}</h1>
        <p className={s.body}>{body}</p>
        <div className={s.ctas}>
          {links.map(({ title, url }, stableIdx) => {
            return (
              <Button
                // eslint-disable-next-line react/no-array-index-key
                key={stableIdx}
                theme={{ variant: 'tertiary' }}
                title={title}
                url={url}
                size="small"
              />
            )
          })}
        </div>
      </article>
    </Card>
  )
}

export default UseCaseCard
