import { ReactElement } from 'react'
import s from './mdx-img.module.css'

/**
 * TODO: support captions somehow.
 * maybe through title attribute...
 * maybe through a custom <Image /> component...
 *
 * Asana task:
 * https://app.asana.com/0/1201987349274776/1201999966887531/f
 */

function MdxImg({
  src,
  alt,
  title,
}: {
  src: string
  alt: string
  title: string
}): ReactElement {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={s.root} src={src} alt={alt} title={title} />
}

export default MdxImg
