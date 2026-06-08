/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { Tutorial } from 'lib/learn-client/types'

export interface TutorialLibraryViewProps {
	defaultTutorials: Omit<Tutorial, 'content'>[]
}
