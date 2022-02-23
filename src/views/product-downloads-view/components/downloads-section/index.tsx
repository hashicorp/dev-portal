import { ReactElement, useMemo } from 'react'
import CodeBlock from '@hashicorp/react-code-block'
import { ReleaseVersion } from 'lib/fetch-release-data'
import Card from 'components/card'
import Heading from 'components/heading'
import { PackageManager } from 'views/product-downloads-view/types'
import { sortPlatforms, prettyOs } from 'views/product-downloads-view/helpers'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import s from './downloads-section.module.css'
import DownloadStandaloneLink from 'components/download-standalone-link'

interface DownloadsSectionProps {
  packageManagers: PackageManager[]
  selectedRelease: ReleaseVersion
}

const DownloadsSection = ({
  packageManagers,
  selectedRelease,
}: DownloadsSectionProps): ReactElement => {
  const downloadsByOS = useMemo(() => sortPlatforms(selectedRelease), [
    selectedRelease,
  ])
  const packageManagersByOS = useMemo(() => {
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
  }, [packageManagers])

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

            const prettyOSName = prettyOs(os)
            return (
              <Tab heading={prettyOSName} key={os}>
                <div className={s.tabContent}>
                  {hasOnePackageManager && (
                    <>
                      <Heading
                        className={s.subHeading}
                        level={3}
                        size={200}
                        slug={`package-manager-for-${prettyOSName}`}
                        weight="semibold"
                      >
                        Package manager for {prettyOSName}
                      </Heading>
                      <CodeBlock
                        code={packageManagers[0].commands
                          .map((command) => `$ ${command}`)
                          .join('\n')}
                        options={{ showClipboard: true }}
                      />
                    </>
                  )}
                  {hasManyPackageManagers && (
                    <>TODO: show tabs component for many package managers</>
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
