import { ReactElement, useMemo } from 'react'
import CodeBlock from '@hashicorp/react-code-block'
import CodeTabs from '@hashicorp/react-code-block/partials/code-tabs'
import { PackageManager } from 'views/product-downloads-view/types'
import { ReleaseVersion } from 'lib/fetch-release-data'
import { sortPlatforms, prettyOs } from 'views/product-downloads-view/helpers'
import Card from 'components/card'
import DownloadStandaloneLink from 'components/download-standalone-link'
import Heading from 'components/heading'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import s from './downloads-section.module.css'
import { DownloadsSectionProps } from './types'

const groupDownloadsByOS = (selectedRelease: ReleaseVersion) => {
  return sortPlatforms(selectedRelease)
}

const groupPackageManagersByOS = (packageManagers: PackageManager[]) => {
  const result = {}

  packageManagers.forEach((packageManager) => {
    const { os } = packageManager
    if (result[os]) {
      result[os].push(packageManager)
    } else {
      result[os] = [packageManager]
    }
  })

  return result
}

const DownloadsSection = ({
  packageManagers,
  selectedRelease,
}: DownloadsSectionProps): ReactElement => {
  const downloadsByOS = useMemo(() => groupDownloadsByOS(selectedRelease), [
    selectedRelease,
  ])
  const packageManagersByOS = useMemo(
    () => groupPackageManagersByOS(packageManagers),
    [packageManagers]
  )

  return (
    <section>
      <Card elevation="base">
        <Heading
          className={s.operatingSystemTitle}
          level={2}
          size={300}
          slug="operating-system"
          weight="bold"
        >
          Operating System
        </Heading>
        <Tabs showAnchorLine>
          {Object.keys(downloadsByOS).map((os) => {
            const packageManagers = packageManagersByOS[os]
            const hasOnePackageManager = packageManagers?.length === 1
            const hasManyPackageManagers = packageManagers?.length > 1
            const hasPackageManagers =
              hasOnePackageManager || hasManyPackageManagers

            const prettyOSName = prettyOs(os)
            return (
              <Tab heading={prettyOSName} key={os}>
                <div className={s.tabContent}>
                  {hasPackageManagers && (
                    <Heading
                      className={s.subHeading}
                      level={3}
                      size={200}
                      slug={`package-manager-for-${prettyOSName}`}
                      weight="semibold"
                    >
                      Package manager for {prettyOSName}
                    </Heading>
                  )}
                  {hasOnePackageManager && (
                    <CodeBlock
                      code={packageManagers[0].commands
                        .map((command: string) => `$ ${command}`)
                        .join('\n')}
                      language="shell-session"
                      options={{ showClipboard: true }}
                    />
                  )}
                  {hasManyPackageManagers && (
                    <CodeTabs
                      className={s.codeTabs}
                      tabs={packageManagers.map(({ label }) => label)}
                    >
                      {packageManagers.map((packageManager) => {
                        console.log(packageManager)
                        return (
                          <CodeBlock
                            key={packageManager.label}
                            code={packageManager.commands
                              .map((command: string) => `$ ${command}`)
                              .join('\n')}
                            language="shell-session"
                            options={{ showClipboard: true }}
                          />
                        )
                      })}
                    </CodeTabs>
                  )}
                  <Heading
                    className={s.subHeading}
                    level={3}
                    size={200}
                    slug={`binary-download-for-${prettyOSName}`}
                    weight="semibold"
                  >
                    Binary download for {prettyOSName}
                  </Heading>
                  {Object.keys(downloadsByOS[os]).map((arch) => (
                    <Card
                      className={s.downloadCard}
                      elevation="base"
                      key={arch}
                    >
                      <div className={s.downloadCardText}>
                        <Text
                          className={s.archNameLabel}
                          size={200}
                          weight="semibold"
                        >
                          {arch.toUpperCase()}
                        </Text>
                        <Text
                          className={s.archVersionLabel}
                          size={200}
                          weight="regular"
                        >
                          Version: {selectedRelease.version}
                        </Text>
                      </div>
                      <DownloadStandaloneLink
                        ariaLabel="TODO"
                        href={downloadsByOS[os][arch]}
                      />
                    </Card>
                  ))}
                </div>
              </Tab>
            )
          })}
        </Tabs>
      </Card>
    </section>
  )
}

export default DownloadsSection
