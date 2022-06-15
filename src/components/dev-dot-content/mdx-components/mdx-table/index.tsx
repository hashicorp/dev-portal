import s from './mdx-table.module.css'

export default function MDXTable(props) {
  return (
    <div className={s.tableWrapper}>
      <table {...props} />
    </div>
  )
}
