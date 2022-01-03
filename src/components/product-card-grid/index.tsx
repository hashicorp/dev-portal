import React, { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { IconConsulColor16 } from '@hashicorp/flight-icons/svg-react/consul-color-16'
import { IconTerraformColor16 } from '@hashicorp/flight-icons/svg-react/terraform-color-16'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import { IconNomadColor16 } from '@hashicorp/flight-icons/svg-react/nomad-color-16'
import { IconPackerColor16 } from '@hashicorp/flight-icons/svg-react/packer-color-16'
import { IconVagrantColor16 } from '@hashicorp/flight-icons/svg-react/vagrant-color-16'
import { IconWaypointColor16 } from '@hashicorp/flight-icons/svg-react/waypoint-color-16'
import { IconBoundaryColor16 } from '@hashicorp/flight-icons/svg-react/boundary-color-16'
import { IconHashicorp16 } from '@hashicorp/flight-icons/svg-react/hashicorp-16'
import s from './style.module.css'

const logoDict = {
  terraform: IconTerraformColor16,
  vault: IconVaultColor16,
  consul: IconConsulColor16,
  nomad: IconNomadColor16,
  packer: IconPackerColor16,
  vagrant: IconVagrantColor16,
  waypoint: IconWaypointColor16,
  boundary: IconBoundaryColor16,
}

const iconDict = {
  hcp: IconHashicorp16,
}

const cardGridSections = [
  {
    title: 'Infrastructure',
    products: [
      {
        slug: 'terraform',
        hasLogo: true,
        heading: 'Terraform',
        subheading: 'Infrastructure as code',
      },
      {
        slug: 'packer',
        hasLogo: true,
        heading: 'Packer',
        subheading: 'Machine images',
      },
    ],
  },
  {
    title: 'Networking',
    products: [
      {
        slug: 'consul',
        hasLogo: true,
        heading: 'Consul',
        subheading: 'Multi-cloud service mesh',
      },
    ],
  },
  {
    title: 'Security',
    products: [
      {
        slug: 'vault',
        hasLogo: true,
        heading: 'Vault',
        subheading: 'Managed secrets',
      },
      {
        slug: 'boundary',
        hasLogo: true,
        heading: 'Boundary',
        subheading: 'Identity-based security',
      },
    ],
  },
  {
    title: 'Application',
    products: [
      {
        slug: 'nomad',
        hasLogo: true,
        heading: 'Nomad',
        subheading: 'Workload orchestration',
      },
      {
        slug: 'waypoint',
        hasLogo: true,
        heading: 'Waypoint',
        subheading: 'Deployment workflows',
      },
      {
        slug: 'vagrant',
        hasLogo: true,
        heading: 'Vagrant',
        subheading: 'Environment workflows',
      },
    ],
  },
  {
    title: 'Cloud',
    products: [
      {
        slug: 'hcp',
        hasLogo: false,
        headingIcon: true,
        heading: 'HashiCorp Cloud Platform (HCP)',
        subheading:
          'A fully managed platform to automate infrastructure on any cloud with HashiCorp products. Available on HCP Vault, HCP Consul, and HCP Packer.',
      },
    ],
  },
  {
    title: 'Policy',
    products: [
      {
        slug: 'sentinel',
        hasLogo: false,
        heading: 'Sentinel',
        subheading:
          'Policy as code framework for HashiCorp Enterprise Products.',
      },
    ],
  },
]
function ProductCardGrid({ className }: { className?: string }): ReactElement {
  return (
    <div className={classNames(s.root, className)}>
      {cardGridSections.map((section) => {
        const { title, products } = section
        return <CardGridSection key={title} title={title} products={products} />
      })}
    </div>
  )
}

function CardGridSection({ title, products }): ReactElement {
  return (
    <div className={s.cardGridSection}>
      <span className={s.sectionHeading}>{title}</span>
      <span className={s.sectionBody}>
        {products.map(({ slug, hasLogo, headingIcon, heading, subheading }) => {
          const Logo = (hasLogo && logoDict[slug]) || null
          const HeadingIcon = (headingIcon && iconDict[slug]) || null
          return (
            <Link key={slug} href={`/${slug}`}>
              <a className={s.sectionBodyCardWrapper}>
                <span className={s.sectionBodyCard}>
                  {Logo && <Logo className={s.sectionBodyCardLogo} />}
                  <span className={s.sectionBodyCardHeading}>
                    {headingIcon && (
                      <HeadingIcon className={s.sectionBodyCardHeadingIcon} />
                    )}
                    {heading}
                  </span>
                  <span className={s.sectionBodyCardSubheading}>
                    {subheading}
                  </span>
                </span>
              </a>
            </Link>
          )
        })}
      </span>
    </div>
  )
}

export default ProductCardGrid
