interface Card {
  iconSvg?: string
  heading: string
  text: string
  url: string
  tags?: string[]
}

export interface CardProps {
  columns: number
  cards: Card[]
}
