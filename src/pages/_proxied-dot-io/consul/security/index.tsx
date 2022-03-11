import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
  return (
    <SecurityView
      productName="Consul"
      githubUrl="https://www.github.com/hashicorp/consul"
    />
  )
}

SecurityPage.layout = ConsulIoLayout
export default SecurityPage
