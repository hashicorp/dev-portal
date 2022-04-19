import { HeadingProps } from 'components/heading'
import { GetStartedProps } from './components/get-started'
import { CardProps } from './components/cards'

export type Block =
  | ({ type: 'heading' } & HeadingProps & { heading: string })
  | ({ type: 'get_started' } & GetStartedProps)
  | ({ type: 'cards' } & CardProps)

export interface ProductLandingProps {
  content: {
    heading: string
    subheading: string
    blocks: Block[]
  }
}
