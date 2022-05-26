import { useRouter } from 'next/router'
import {
  ErrorViewContainer,
  ErrorViewH1,
  ErrorViewParagraph,
} from '../components'
import ButtonLink from 'components/button-link'
import InlineLink from 'components/inline-link'
import useErrorPageAnalytics from '@hashicorp/react-error-view/use-error-page-analytics'
import s from './dev-dot-versioned-404.module.css'

export function DevDotVersioned404({
  version,
  pathWithoutVersion,
}: {
  version: string
  pathWithoutVersion: string
}): React.ReactElement {
  useErrorPageAnalytics(404)

  const { asPath } = useRouter()

  /**
   * Note: this way of determining the basePath isn't perfect,
   * but it works for all Vault and Waypoint docs routes, at least.
   *
   * A more robust version would perhaps select the entire URL
   * BEFORE the detected version string instead.
   * Maybe that could be determined with a similar version regex,
   * and passed into this component as pathBeforeVersion?
   */
  const basePath = asPath.split('/').slice(1, 3).join('/')

  return (
    <ErrorViewContainer>
      <ErrorViewH1>This page does not exist for version {version}.</ErrorViewH1>
      <ErrorViewParagraph>
        Please select either the{' '}
        <InlineLink href={pathWithoutVersion} text="most recent version" /> or a
        valid version that includes the page you are&nbsp;looking&nbsp;for.
      </ErrorViewParagraph>
      <div className={s.cta}>
        <ButtonLink text="Go back to Documentation" href={`/${basePath}`} />
      </div>
    </ErrorViewContainer>
  )
}
