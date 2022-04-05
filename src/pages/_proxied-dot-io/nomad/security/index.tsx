import NomadIoLayout from 'layouts/_proxied-dot-io/nomad'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
  return (
    <SecurityView
      productName="Nomad"
      githubUrl="https://www.github.com/hashicorp/nomad"
    />
  )
}

export function getStaticProps() {
  // This function intentionally left blank to allow Next to use SSG.
  return { props: {} }
}

SecurityPage.layout = NomadIoLayout
export default SecurityPage
