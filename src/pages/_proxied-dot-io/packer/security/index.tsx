import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
  return (
    <SecurityView
      productName="Packer"
      githubUrl="https://www.github.com/hashicorp/packer"
    />
  )
}

SecurityPage.layout = PackerIoLayout
export default SecurityPage
