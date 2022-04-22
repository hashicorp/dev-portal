import Badge from 'components/badge'
import s from './product-docs-search.module.css'

export default function SearchResultsLegend() {
  return (
    <div className={s.legend}>
      <Badge text="↑" /> <Badge text="↓" /> to navigate, <Badge text="ENTER" />{' '}
      to select, <Badge text="ESC" /> to dismiss
    </div>
  )
}
