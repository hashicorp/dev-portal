import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
  return (
    <SecurityView
      productName="Boundary"
      githubUrl="https://www.github.com/hashicorp/boundary"
    />
  )
}

SecurityPage.layout = BoundaryIoLayout
export default SecurityPage
