import { VideoHostOption } from 'lib/learn-client/types'

const urlBase = {
  [VideoHostOption.youtube]: 'https://www.youtube.com/watch?v=',
  [VideoHostOption.wistia]: 'https://hashicorp.wistia.com/medias/',
}

export default function getVideoUrl({
  videoHost,
  videoId,
}: {
  videoHost: VideoHostOption
  videoId: string
}): string {
  return `${urlBase[videoHost]}${videoId}`
}
