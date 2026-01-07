/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from '@hashicorp/sentinel-embedded/dist/bundle.module.css'
import template from '@hashicorp/sentinel-embedded/src/components/playground-template'
import '@hashicorp/sentinel-embedded'

interface Data {
  policy: string
  mocks?: Record<string, string>
  parameters?: Record<string, string>
  globals?: Record<string, string>
}

interface SentinelEmbeddedProps {
  exampleId?: string
  exampleData?: Data
  height: string
  policyContent?: string
  [key: string]: unknown
}

function SentinelEmbedded({
  exampleId,
  exampleData,
  height,
  policyContent,
  ...otherProps
}: SentinelEmbeddedProps) {
  let example: Data | string | undefined = undefined
  if (typeof exampleData != 'undefined') {
    example = exampleData
  } else if (policyContent) {
    example = {
      policy: policyContent,
    }
  }

  if (typeof example != 'undefined') {
    example = JSON.stringify(example)
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore: Augmenting JSX.IntrinsicAttributes doesn't seem to work
    <sentinel-playground
      {...otherProps}
      exampleId={exampleId}
      exampleData={example}
      height={height}
      dangerouslySetInnerHTML={{ __html: template(s, height) }}
    />
  )
}

export default SentinelEmbedded
