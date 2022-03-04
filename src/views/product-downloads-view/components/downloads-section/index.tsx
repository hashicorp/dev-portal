import { ReactElement, useMemo } from 'react'
import classNames from 'classnames'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import CodeBlock from '@hashicorp/react-code-block'
import { useCurrentProduct } from 'contexts'
import { prettyOs } from 'views/product-downloads-view/helpers'
import { useCurrentVersion } from 'views/product-downloads-view/current-version-context'
import Card from 'components/card'
import DownloadStandaloneLink from 'components/download-standalone-link'
import Heading, { HeadingProps } from 'components/heading'
import InlineLink from 'components/inline-link'
import ProductIcon from 'components/product-icon'
import StandaloneLink from 'components/standalone-link'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import VersionContextSwitcher from 'components/version-context-switcher'
import { DownloadsSectionProps } from './types'
import {
  generateCodePropFromCommands,
  groupDownloadsByOS,
  groupPackageManagersByOS,
} from './helpers'
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

  if (!hasPackageManagers) {
    return null
  }

  return (
    <>
      <Heading
        {...SHARED_HEADING_LEVEL_3_PROPS}
        slug={`package-manager-for-${prettyOSName}`}
      >
        Package manager for {prettyOSName}
      </Heading>
      {hasOnePackageManager && (
        <CodeBlock
          code={generateCodePropFromCommands(packageManagers[0].commands)}
          language="shell-session"
          options={{ showClipboard: true }}
        />
      )}
      {hasManyPackageManagers && (
        /**
         * TODO: this will eventually be <CodeTabs> once a bug has
         * been fixed.
         *
         * ref: https://app.asana.com/0/1201010428539925/1201881376116200/f
         */
        <Tabs showAnchorLine={false}>
          {packageManagers.map(({ label, commands }) => {
            return (
              <Tab heading={label} key={label}>
                <CodeBlock
                  className={s.codeTabsCodeBlock}
                  code={generateCodePropFromCommands(commands)}
                  language="shell-session"
                  options={{ showClipboard: true }}
                />
              </Tab>
            )
          })}
        </Tabs>
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
        slug={`binary-download-for-${prettyOSName}`}
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
      <Heading {...SHARED_HEADING_LEVEL_3_PROPS} slug="release-information">
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
          textSize={200}
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
        slug="notes"
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
  latestVersionIsSelected,
  packageManagers,
  selectedRelease,
  versionSwitcherOptions,
}: DownloadsSectionProps): ReactElement => {
  const currentProduct = useCurrentProduct()
  const [, setCurrentVersion] = useCurrentVersion()
  const downloadsByOS = useMemo(() => groupDownloadsByOS(selectedRelease), [
    selectedRelease,
  ])
  const packageManagersByOS = useMemo(
    () => groupPackageManagersByOS(packageManagers),
    [packageManagers]
  )

  return (
    <article className={s.root}>
      <Card elevation="base">
        <div className={s.cardHeader}>
          <Heading
            className={s.operatingSystemTitle}
            level={2}
            size={300}
            slug="operating-system"
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
              leadingIcon={<ProductIcon product={currentProduct.slug} />}
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
                  {latestVersionIsSelected && (
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
    </article>
  )
}

export default DownloadsSection
