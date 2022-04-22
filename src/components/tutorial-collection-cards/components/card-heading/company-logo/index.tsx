import Image from 'next/image'
import { CompanyLogoOption, CompanyLogoProps } from './types'

export default function CompanyLogo({ name }: CompanyLogoProps): JSX.Element {
  if (!(name in CompanyLogoOption)) {
    console.log('Company Logo does not exist')
    return <></>
  }

  const src =
    name === 'terraform-cloud'
      ? require('@hashicorp/mktg-logos/product/terraform-cloud/primary/color.svg')
      : require(`./img/${name}.png`)

  return (
    <Image
      src={src}
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
}
