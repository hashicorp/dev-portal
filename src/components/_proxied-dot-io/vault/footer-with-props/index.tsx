import Footer from 'components/_proxied-dot-io/vault/footer'

function FooterWithProps({
  openConsentManager,
}: {
  openConsentManager: () => void
}): React.ReactElement {
  return <Footer openConsentManager={openConsentManager} />
}

export default FooterWithProps
