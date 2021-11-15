import $$layoutName from '$$layoutPath'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
  return (
    <SecurityView
      productName="$$productName"
      githubUrl="$$githubUrl"
    />
  )
}

SecurityPage.layout = $$layoutName
export default SecurityPage
