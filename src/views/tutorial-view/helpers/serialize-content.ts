import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import {
  anchorLinks,
  paragraphCustomAlerts,
  typography,
} from '@hashicorp/remark-plugins'
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import highlight from '@mapbox/rehype-prism'
import getVideoUrl from './get-video-url'
import { Tutorial as ClientTutorial } from 'lib/learn-client/types'
import { rewriteStaticAssetsPlugin } from 'lib/remark-plugins/rewrite-static-assets'

export async function serializeContent(
  tutorial: ClientTutorial
): Promise<MDXRemoteSerializeResult> {
  const video = tutorial?.video
  //  add `video` to MDX scope if the video is being displayed inline
  const scope = video?.videoInline
    ? {
        video: getVideoUrl({
          videoId: video.id,
          videoHost: video.videoHost,
        }),
      }
    : {}

  const content = await serialize(tutorial.content, {
    scope,
    mdxOptions: {
      remarkPlugins: [
        anchorLinks,
        paragraphCustomAlerts,
        typography,
        rewriteStaticAssetsPlugin,
      ],
      rehypePlugins: [
        [highlight, { ignoreMissing: true }],
        rehypeSurfaceCodeNewlines,
      ],
    },
  })

  return content
}
