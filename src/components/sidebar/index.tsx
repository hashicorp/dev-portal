import { ChangeEvent, useRef, useState } from 'react'
import InlineSvg from '@hashicorp/react-inline-svg'
import s from './style.module.css'

// TODO: Move this into it's own file
// TODO: design is still planning this functionality
const BackToLink = () => (
  <a className={s.backToLink}>
    <InlineSvg
      className={s.icon}
      src={require('@hashicorp/flight-icons/svg/arrow-left-16.svg?include')}
    />
    <span>Back to lorem ipsum</span>
  </a>
)

// TODO: move this into its own file
const FilterInput = () => {
  const inputRef = useRef<HTMLInputElement>()
  const [filterValue, setFilterValue] = useState('')
  const showClearButton = filterValue

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setFilterValue(newValue)
  }

  const handleClear = () => {
    setFilterValue('')
    inputRef.current.focus()
  }

  const handleFocus = () => {
    if (!filterValue) {
      return
    }
  }

  return (
    <div className={s.filterInput}>
      <InlineSvg
        className={s.filterIcon}
        src={require('@hashicorp/flight-icons/svg/filter-16.svg?include')}
      />
      <input
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Filter sidebar"
        ref={inputRef}
        value={filterValue}
      />
      {showClearButton && (
        <button
          aria-label="Clear filter"
          className={s.clearButton}
          onClick={handleClear}
        >
          <InlineSvg
            className={s.clearIcon}
            src={require('@hashicorp/flight-icons/svg/x-16.svg?include')}
          />
        </button>
      )}
    </div>
  )
}

const Sidebar: React.FC = () => (
  <div className={s.sidebar}>
    <BackToLink />
    <FilterInput />
    <div></div>
    <p className={s.navTitle}>Nav title</p>
    <div>items</div>
  </div>
)

export default Sidebar
