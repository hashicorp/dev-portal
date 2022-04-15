import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import s from './style.module.css'

export interface IoHomeFeatureProps {
  link?: string
  image: {
    url: string
    alt: string
  }
  heading: string
  description: string
}

export default function IoHomeFeature({
  link,
  image,
  heading,
  description,
}: IoHomeFeatureProps): React.ReactElement {
  return (
    <IoHomeFeatureWrap href={link}>
      <div className={s.featureMedia}>
        <div style={{ width: '100%' }}>
          <Image
            src={image.url}
            width={400}
            height={200}
            layout="responsive"
            alt={image.alt}
          />
        </div>
      </div>
      <div className={s.featureContent}>
        <h3 className={s.featureHeading}>{heading}</h3>
        <p className={s.featureDescription}>{description}</p>
        {link ? (
          <span className={s.featureCta} aria-hidden={true}>
            Learn more{' '}
            <span>
              <IconArrowRight16 />
            </span>
          </span>
        ) : null}
      </div>
    </IoHomeFeatureWrap>
  )
}

function IoHomeFeatureWrap({ href, children }: $TSFixMe) {
  if (!href) {
    return <div className={s.feature}>{children}</div>
  }

  return (
    <Link href={href}>
      <a className={s.feature}>{children}</a>
    </Link>
  )
}
