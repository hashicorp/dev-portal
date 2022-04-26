import Image from 'next/image'
import classNames from 'classnames'
import { CompanyLogoOption, CompanyLogoProps } from './types'
import s from './company-logo.module.css'

const LOGO_TO_SOURCE_MAP: Record<CompanyLogoOption, string> = {
  'terraform-cloud':
    '@hashicorp/mktg-logos/product/terraform-cloud/primary/color.svg',
  oci: './img/oci.png',
  docker: './img/docker.png',
  github: './img/github.png',
  'microsoft-azure': './img/microsoft-azure.png',
  'google-cloud': './img/google-cloud.png',
  aws: './img/aws.png',
}

export default function CompanyLogo({ name }: CompanyLogoProps): JSX.Element {
  if (!(name in CompanyLogoOption)) {
    console.log('Company Logo does not exist')
    return <></>
  }

  return (
    <span className={s.root}>
      <span className={classNames(s.inner, s[`logo-${name}`])}>
        <Image
          src={require(LOGO_TO_SOURCE_MAP[name])}
          alt=""
          /**
           * Note: for use in CollectionCard, consumer should provide meaningful
           * text using the card heading element.
           */
          objectPosition="left center"
          layout="fill"
          objectFit="contain"
        />
      </span>
    </span>
  )
}
