import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
  return (
    <SecurityView
      productName="Waypoint"
      githubUrl="https://www.github.com/hashicorp/waypoint"
    />
  )
}

SecurityPage.layout = WaypointIoLayout
export default SecurityPage
