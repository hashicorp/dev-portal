import Button from '@hashicorp/react-button'
import Card from 'components/card'
import FlexGrid from '../flex-grid'
import { ReactElement } from 'react'
import s from './style.module.css'

interface UseCaseCardProps {
  heading: string
  body: string
  links: {
    title: string
    url: string
  }[]
}

function UseCaseCard({ heading, body, links }: UseCaseCardProps): ReactElement {
  return (
    <Card>
      <article>
        <h1 className={s.useCaseCardHeading}>{heading}</h1>
        <p className={s.useCaseCardBody}>{body}</p>
        <div className={s.useCaseCardCtas}>
          <FlexGrid gap={16}>
            {links.map(({ title, url }, stableIdx) => {
              return (
                <Button
                  // eslint-disable-next-line react/no-array-index-key
                  key={stableIdx}
                  theme={{
                    variant: 'tertiary',
                    // TODO: use product context, or expose via prop
                    brand: 'vault',
                  }}
                  title={title}
                  url={url}
                  size="small"
                />
              )
            })}
          </FlexGrid>
        </div>
      </article>
    </Card>
  )
}

export default UseCaseCard
