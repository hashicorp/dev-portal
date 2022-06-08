import Image from 'next/image'
import classNames from 'classnames'
import { CompanyLogoOption, CompanyLogoProps } from './types'
import s from './company-logo.module.css'

export default function CompanyLogo({ name }: CompanyLogoProps): JSX.Element {
  if (!(name in CompanyLogoOption)) {
    console.log('Company Logo does not exist')
    return <></>
  }

  let image = null
  switch (name) {
    case 'aws': {
      image = (
        <Image
          src={require(`./img/aws.png`)}
          alt=""
          /**
           * Note: for use in CollectionCard, consumer should provide meaningful
           * text using the card heading element.
           */
          objectPosition="left center"
          layout="fill"
          objectFit="contain"
        />
      )
      break
    }
    case 'docker': {
      image = (
        <Image
          src={require(`./img/docker.png`)}
          alt=""
          /**
           * Note: for use in CollectionCard, consumer should provide meaningful
           * text using the card heading element.
           */
          objectPosition="left center"
          layout="fill"
          objectFit="contain"
        />
      )
      break
    }
    case 'github': {
      image = (
        <Image
          src={require(`./img/github.png`)}
          alt=""
          /**
           * Note: for use in CollectionCard, consumer should provide meaningful
           * text using the card heading element.
           */
          objectPosition="left center"
          layout="fill"
          objectFit="contain"
        />
      )
      break
    }
    case 'google-cloud': {
      image = (
        <Image
          src={require(`./img/google-cloud.png`)}
          alt=""
          /**
           * Note: for use in CollectionCard, consumer should provide meaningful
           * text using the card heading element.
           */
          objectPosition="left center"
          layout="fill"
          objectFit="contain"
        />
      )
      break
    }
    case 'microsoft-azure': {
      image = (
        <Image
          src={require(`./img/microsoft-azure.png`)}
          alt=""
          /**
           * Note: for use in CollectionCard, consumer should provide meaningful
           * text using the card heading element.
           */
          objectPosition="left center"
          layout="fill"
          objectFit="contain"
        />
      )
      break
    }
    case 'oci': {
      image = (
        <Image
          src={require(`./img/oci.png`)}
          alt=""
          /**
           * Note: for use in CollectionCard, consumer should provide meaningful
           * text using the card heading element.
           */
          objectPosition="left center"
          layout="fill"
          objectFit="contain"
        />
      )
      break
    }
    case 'terraform-cloud': {
      image = (
        <Image
          src={require('@hashicorp/mktg-logos/product/terraform-cloud/primary/color.svg')}
          alt=""
          /**
           * Note: for use in CollectionCard, consumer should provide meaningful
           * text using the card heading element.
           */
          objectPosition="left center"
          layout="fill"
          objectFit="contain"
        />
      )
      break
    }
  }

  return (
    <span className={s.root}>
      <span className={classNames(s.inner, s[`logo-${name}`])}>{image}</span>
    </span>
  )
}
