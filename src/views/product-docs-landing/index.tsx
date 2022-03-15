import { ReactElement } from 'react'
import Card, { CardLink } from 'components/card'
import Button from '@hashicorp/react-button'
import s from './style.module.css'

function ProductDocsLanding(): ReactElement {
  return (
    <div className={s.pageContents}>
      <h1 className="g-type-display-2">Documentation</h1>
      <p>
        Welcome to Vault documentation! Vault is an identity-based secret and
        encryption management system. This documentation covers the main
        concepts of Vault, what problems it can solve, and contains a quick
        start for using Vault.
      </p>
      <FeaturedCard />
      <h2 className="g-type-display-3">Use Cases</h2>
      <div className={s.useCaseCards}>
        <UseCaseCard
          heading="Secrets Management"
          body="Centrally store, access, and deploy secrets across applications, systems, and infrastructure."
          links={[
            {
              title: 'Key/Value',
              url: 'https://www.hashicorp.com',
            },
            {
              title: 'Database Credentials',
              url: 'https://www.hashicorp.com',
            },
            {
              title: 'Kubernetes Secrets',
              url: 'https://www.hashicorp.com',
            },
          ]}
        />
        <UseCaseCard
          heading="Encryption Services"
          body="Securely handle data such as social security numbers, credit card numbers, and other types of compliance-regulated information."
          links={[
            {
              title: 'Transit Secrets Engine',
              url: 'https://www.hashicorp.com',
            },
            {
              title: 'Transform Secrets Engine',
              url: 'https://www.hashicorp.com',
            },
            {
              title: 'Tokenization',
              url: 'https://www.hashicorp.com',
            },
          ]}
        />
        <UseCaseCard
          heading="Key Management"
          body="Use a standardized workflow for distribution and lifecycle management of cryptographic keys in various KMS providers."
          links={[
            {
              title: 'KMIP Secrets Engine',
              url: 'https://www.hashicorp.com',
            },
            {
              title: 'Key Management Secrets Engine',
              url: 'https://www.hashicorp.com',
            },
            {
              title: 'PKI',
              url: 'https://www.hashicorp.com',
            },
          ]}
        />
      </div>
      <h2 className="g-type-display-3">Developers</h2>
      <div className={s.developerCards}>
        <CardLink href="https://www.vaultproject.io/api-docs/libraries">
          Client Libraries
        </CardLink>
        <CardLink href="https://www.vaultproject.io/api-docs/index">
          API Reference
        </CardLink>
        <CardLink href="https://github.com/hashicorp/hello-vault-go">
          Sample Integrations
        </CardLink>
        <CardLink href="https://github.com/hashicorp/vault-examples">
          GitHub Samples
        </CardLink>
      </div>
    </div>
  )
}

function FeaturedCard() {
  const heading = 'Get Started'
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const imgSrc = require('./vault-get-started-diagram.png')
  const body =
    'Use Vault to securely store, access, and manage secrets and other sensitive data.'
  const links = [
    {
      title: 'CLI Quick Start',
      url: 'https://www.hashicorp.com',
    },
    {
      title: 'Developer Quick Start',
      url: 'https://www.hashicorp.com',
    },
  ]
  return (
    <Card className={s.featuredCard}>
      <article className={s.featuredCardContent}>
        <div className={s.featuredCardText}>
          <h1 className={s.featuredCardHeading}>{heading}</h1>
          <p className={s.featuredCardBody}>{body}</p>
          <div className={s.featuredCardCtas}>
            <div className={s.flexGridParent}>
              {links.map(({ title, url }, stableIdx) => {
                const variant = stableIdx == 0 ? 'primary' : 'secondary'
                return (
                  <Button
                    // eslint-disable-next-line react/no-array-index-key
                    key={stableIdx}
                    theme={{
                      variant,
                      brand: 'vault',
                    }}
                    title={title}
                    url={url}
                    size="small"
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className={s.featuredCardImage}>
          <img src={imgSrc} alt="" />
        </div>
      </article>
    </Card>
  )
}

function UseCaseCard({ heading, body, links }) {
  return (
    <Card>
      <article className={s.useCaseCardContent}>
        <h1 className={s.useCaseCardHeading}>{heading}</h1>
        <p className={s.useCaseCardBody}>{body}</p>
        <div className={s.useCaseCardCtas}>
          <div className={s.flexGridParent}>
            {links.map(({ title, url }, stableIdx) => {
              return (
                <Button
                  // eslint-disable-next-line react/no-array-index-key
                  key={stableIdx}
                  theme={{
                    variant: 'tertiary',
                    brand: 'vault',
                  }}
                  title={title}
                  url={url}
                  size="small"
                />
              )
            })}
          </div>
        </div>
      </article>
    </Card>
  )
}

export default ProductDocsLanding
