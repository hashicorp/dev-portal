import VagrantIoLayout from 'layouts/_proxied-dot-io/vagrant'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
  return (
    <SecurityView
      productName="Vagrant"
      githubUrl="https://www.github.com/hashicorp/vagrant"
    />
  )
}

SecurityPage.layout = VagrantIoLayout
export default SecurityPage
