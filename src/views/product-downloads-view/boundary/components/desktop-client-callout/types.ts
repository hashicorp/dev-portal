import { OperatingSystem } from 'lib/fetch-release-data'

export interface ReleaseBuild {
	os: OperatingSystem
	url: string
	filename: string
	arch: string
}

export interface DesktopClientProps {
	latestVersion: string
	builds: ReleaseBuild[]
}
