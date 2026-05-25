/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import Text from 'components/text'
import s from './mdx-p.module.css'

function MdxP(props) {
	return <Text {...props} className={s.p} />
}

export { MdxP }
