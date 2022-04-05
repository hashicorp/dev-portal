import VaultIoLayout from 'layouts/_proxied-dot-io/vault'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
  return (
    <SecurityView
      productName="Vault"
      githubUrl="https://www.github.com/hashicorp/vault"
    />
  )
}

export function getStaticProps() {
  // This function intentionally left blank to allow Next to use SSG.
  return { props: {} }
}

SecurityPage.layout = VaultIoLayout
export default SecurityPage
