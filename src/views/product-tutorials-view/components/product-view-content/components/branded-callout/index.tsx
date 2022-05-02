import { CSSProperties } from 'react'
import Image from 'next/image'
import StandaloneLink from 'components/standalone-link'
import { BrandedCalloutProps } from './types'
import { ProductOption } from 'lib/learn-client/types'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import s from './branded-callout.module.css'
// Note: images are static imports, seems to be a requirement of next/image
// ref: https://nextjs.org/docs/basic-features/image-optimization#local-images
import patternBoundary from './img/boundary.png'
import patternConsul from './img/consul.png'
import patternNomad from './img/nomad.png'
import patternPacker from './img/packer.png'
import patternTerraform from './img/terraform.png'
import patternVagrant from './img/vagrant.png'
import patternVault from './img/vault.png'
import patternWaypoint from './img/waypoint.png'

const PATTERN_IMG_MAP: Record<ProductOption, string> = {
  boundary: patternBoundary,
  consul: patternConsul,
  nomad: patternNomad,
  packer: patternPacker,
  terraform: patternTerraform,
  vagrant: patternVagrant,
  vault: patternVault,
  waypoint: patternWaypoint,
}

function BrandedCallout({
  heading,
  subheading,
  cta,
  product,
}: BrandedCalloutProps) {
  return (
    <div
      className={s.root}
      style={
        {
          '--gradient-start': `var(--token-color-${product}-gradient-faint-start)`,
          '--gradient-stop': `var(--token-color-${product}-gradient-faint-stop)`,
        } as CSSProperties
      }
    >
      <div className={s.textContainer}>
        <h2 className={s.heading}>
          {heading}
        </h2>
        {subheading ? <p className={s.subheading}>{subheading}</p> : null}
        <p className={s.cta}>
          <StandaloneLink
            text={cta.text}
            href={cta.url}
            icon={<IconArrowRight16 />}
            iconPosition="trailing"
            color="secondary"
          />
        </p>
      </div>
      <div className={s.productPattern}>
        <Image
          src={PATTERN_IMG_MAP[product]}
          /** Note: pattern image is purely decorative */
          alt=""
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    </div>
  )
}

export type { BrandedCalloutProps }
export { BrandedCallout }
