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

export function getStaticProps() {
  // This function intentionally left blank to allow Next to use SSG.
  return { props: {} }
}

SecurityPage.layout = VagrantIoLayout
export default SecurityPage
