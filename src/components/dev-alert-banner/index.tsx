import AlertBanner from 'components/alert-banner'

function DevAlertBanner(): React.ReactElement {
  return (
    <AlertBanner type="highlight">
      <p>
        You are viewing an internal preview and work in progress version of this
        site.{' '}
        <a
          href="https://airtable.com/shrU3eYHIOXO60o23"
          rel="noopener noreferrer"
          target="_blank"
        >
          We&apos;d love to hear your feedback
        </a>
        !
      </p>
    </AlertBanner>
  )
}

export default DevAlertBanner
