import Badge from 'components/badge'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './hero.module.css'

export default function Hero({ heading, description }) {
  return (
    <header className={s.hero}>
      <div className={s.container}>
        <div className={s.content}>
          <Badge text="Beta" color="highlight" type="outlined" />
          <Heading
            className={s.title}
            level={1}
            size={500}
            weight="bold"
            slug="testing"
          >
            {heading}
          </Heading>
          <div className={s.description}>
            <Text size={300}>
              The home of HashiCorp documentation and learning content for
              developers and technology professionals.
            </Text>
            <Text size={300}>More products and featrues coming soon....</Text>
          </div>
        </div>
      </div>
    </header>
  )
}
