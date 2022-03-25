import { ReactElement } from 'react'
import { MdxImgProps } from './types'
import classNames from 'classnames'
import s from './mdx-img.module.css'

function MdxImg({ src, alt, title, noMargin }: MdxImgProps): ReactElement {
  return (
    <div className={classNames(s.root, { [s.noMargin]: noMargin })}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.img} src={src} alt={alt} title={title} />
    </div>
  )
}

export default MdxImg
