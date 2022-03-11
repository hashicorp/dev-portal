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

SecurityPage.layout = VaultIoLayout
export default SecurityPage
