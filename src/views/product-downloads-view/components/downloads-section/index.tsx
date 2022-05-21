// Third-party imports
import { ReactElement, useMemo, useRef, MutableRefObject } from 'react'
import classNames from 'classnames'

// HashiCorp imports
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import CodeBlock from '@hashicorp/react-code-block'
import CodeTabs from '@hashicorp/react-code-block/partials/code-tabs'

// Global imports
import useRefocus from 'lib/hooks/use-refocus'
import { trackProductDownload } from 'lib/analytics'
import { useCurrentProduct } from 'contexts'
import { prettyOs } from 'views/product-downloads-view/helpers'
import { useCurrentVersion } from 'views/product-downloads-view/contexts'
import Card from 'components/card'
import DownloadStandaloneLink from 'components/download-standalone-link'
import Heading, { HeadingProps } from 'components/heading'
import InlineLink from 'components/inline-link'
import StandaloneLink from 'components/standalone-link'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import VersionContextSwitcher from 'components/version-context-switcher'

// Local imports
import { DownloadsSectionProps } from './types'
import {
  generateCodePropFromCommands,
  groupDownloadsByOS,
  groupPackageManagersByOS,
} from './helpers'
import toastOnCopy from './toast-on-copy'
import s from './downloads-section.module.css'

const SHARED_HEADING_LEVEL_3_PROPS = {
  className: s.subHeading,
  level: 3 as HeadingProps['level'],
  size: 200 as HeadingProps['size'],
  weight: 'semibold' as HeadingProps['weight'],
}

const PackageManagerSection = ({ packageManagers, prettyOSName }) => {
  const hasOnePackageManager = packageManagers?.length === 1
  const hasManyPackageManagers = packageManagers?.length > 1
  const hasPackageManagers = hasOnePackageManager || hasManyPackageManagers
  const activatorRef: MutableRefObject<HTMLButtonElement> = useRef()
  const refocusActivator = useRefocus(activatorRef)

  if (!hasPackageManagers) {
    return null
  }

  return (
    <>
      <Heading
        {...SHARED_HEADING_LEVEL_3_PROPS}
        id={`package-manager-for-${prettyOSName}`}
      >
        Package manager for {prettyOSName}
      </Heading>
      <button
        ref={activatorRef}
        onClick={() => toastOnCopy(true, { prettyOSName }, refocusActivator)}
      >
        Toast activator placeholder
      </button>
      {hasOnePackageManager && (
        <CodeBlock
          code={generateCodePropFromCommands(packageManagers[0].commands)}
          language="shell-session"
          options={{ showClipboard: true }}
          onCopyCallBack={(copiedState: boolean | null) => {
            toastOnCopy(copiedState, { prettyOSName }, refocusActivator)
          }}
        />
      )}
      {hasManyPackageManagers && (
        <CodeTabs tabs={packageManagers.map(({ label }) => label)}>
          {packageManagers.map(({ label, commands }) => {
            return (
              <CodeBlock
                key={label}
                className={s.codeTabsCodeBlock}
                code={generateCodePropFromCommands(commands)}
                language="shell-session"
                options={{ showClipboard: true }}
                onCopyCallBack={(copiedState: boolean | null) => {
                  toastOnCopy(
                    copiedState,
                    { prettyOSName, packageManagerLabel: label },
                    refocusActivator
                  )
                }}
              />
            )
          })}
        </CodeTabs>
      )}
    </>
  )
}

const BinaryDownloadsSection = ({
  downloadsByOS,
  os,
  prettyOSName,
  selectedRelease,
}) => {
  const { name, version } = selectedRelease
  return (
    <>
      <Heading
        {...SHARED_HEADING_LEVEL_3_PROPS}
        id={`binary-download-for-${prettyOSName}`}
      >
        Binary download for {prettyOSName}
      </Heading>
      {Object.keys(downloadsByOS[os]).map((arch) => (
        <Card className={s.textAndLinkCard} elevation="base" key={arch}>
          <div className={s.textAndLinkCardTextContainer}>
            <Text
              className={s.textAndLinkCardLabel}
              size={200}
              weight="semibold"
            >
              {arch.toUpperCase()}
            </Text>
            <Text
              className={s.textAndLinkCardVersionLabel}
              size={200}
              weight="regular"
            >
              Version: {version}
            </Text>
          </div>
          <DownloadStandaloneLink
            ariaLabel={`download ${name} version ${version} for ${prettyOSName}, architecture ${arch}`}
            href={downloadsByOS[os][arch]}
            onClick={() => {
              trackProductDownload({
                productSlug: name,
                version,
                prettyOSName,
                architecture: arch,
              })
            }}
          />
        </Card>
      ))}
    </>
  )
}

const ChangelogSection = ({ selectedRelease }) => {
  const { name, version } = selectedRelease
  return (
    <>
      <Heading {...SHARED_HEADING_LEVEL_3_PROPS} id="release-information">
        Release information
      </Heading>
      <Card className={s.textAndLinkCard} elevation="base">
        <div className={s.textAndLinkCardTextContainer}>
          <Text className={s.textAndLinkCardLabel} size={200} weight="semibold">
            Changelog
          </Text>
          <Text
            className={s.textAndLinkCardVersionLabel}
            size={200}
            weight="regular"
          >
            Version: {version}
          </Text>
        </div>
        <StandaloneLink
          ariaLabel={`${name} version ${version} changelog`}
          href={`https://github.com/hashicorp/${name}/blob/v${version}/CHANGELOG.md`}
          icon={<IconExternalLink16 />}
          iconPosition="trailing"
          openInNewTab
          text="GitHub"
        />
      </Card>
    </>
  )
}

const NotesSection = ({ selectedRelease }) => {
  const currentProduct = useCurrentProduct()
  const { name, shasums, shasums_signature, version } = selectedRelease

  return (
    <>
      <Heading
        {...SHARED_HEADING_LEVEL_3_PROPS}
        className={classNames(
          SHARED_HEADING_LEVEL_3_PROPS.className,
          s.specialSubHeading
        )}
        id="notes"
      >
        Notes
      </Heading>
      <Text size={200}>
        You can find the{' '}
        <InlineLink
          href={`https://releases.hashicorp.com/${name}/${version}/${shasums}`}
          text={`SHA256 checksums for ${currentProduct.name} ${version}`}
          textSize={200}
        />{' '}
        online and you can{' '}
        <InlineLink
          href={`https://releases.hashicorp.com/${name}/${version}/${shasums_signature}`}
          text="verify the checksums signature file"
          textSize={200}
        />{' '}
        which has been signed using{' '}
        <InlineLink
          href="https://www.hashicorp.com/security"
          text="HashiCorp's GPG key"
          textSize={200}
        />
        .
      </Text>
    </>
  )
}

const DownloadsSection = ({
  packageManagers,
  selectedRelease,
  versionSwitcherOptions,
}: DownloadsSectionProps): ReactElement => {
  const { isLatestVersion, setCurrentVersion } = useCurrentVersion()
  const downloadsByOS = useMemo(
    () => groupDownloadsByOS(selectedRelease),
    [selectedRelease]
  )
  const packageManagersByOS = useMemo(
    () => groupPackageManagersByOS(packageManagers),
    [packageManagers]
  )

  return (
    <div className={s.root}>
      <Card elevation="base">
        <div className={s.cardHeader}>
          <Heading
            className={s.operatingSystemTitle}
            level={2}
            size={300}
            id="operating-system"
            weight="bold"
          >
            Operating System
          </Heading>
          {/*
          NOTE: This wrapper `<div>` shrinks `VersionContextSwitcher` to only
          take up as much space as needed for its content, an effect of using
          flexbox to render the `Heading` and `VersionContextSwitcher` in the
          same line.
          */}
          <div>
            <VersionContextSwitcher
              onChange={(e) => setCurrentVersion(e.target.value)}
              options={versionSwitcherOptions}
            />
          </div>
        </div>
        <Tabs showAnchorLine>
          {Object.keys(downloadsByOS).map((os) => {
            const packageManagers = packageManagersByOS[os]
            const prettyOSName = prettyOs(os)

            /**
             * TODO: it might be nice to introduce a local Context here with all
             * the information needed so that these helper components don't have
             * APIs that could potentially require changes with every visual
             * change.
             */
            return (
              <Tab heading={prettyOSName} key={os}>
                <div className={s.tabContent}>
                  {isLatestVersion && (
                    <PackageManagerSection
                      packageManagers={packageManagers}
                      prettyOSName={prettyOSName}
                    />
                  )}
                  <BinaryDownloadsSection
                    downloadsByOS={downloadsByOS}
                    os={os}
                    prettyOSName={prettyOSName}
                    selectedRelease={selectedRelease}
                  />
                  <ChangelogSection selectedRelease={selectedRelease} />
                  <NotesSection selectedRelease={selectedRelease} />
                </div>
              </Tab>
            )
          })}
        </Tabs>
      </Card>
    </div>
  )
}

export default DownloadsSection
