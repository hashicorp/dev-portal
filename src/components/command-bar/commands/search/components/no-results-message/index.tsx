/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Text from 'components/text'
import s from './no-results-message.module.css'

const NoResultsMessage = () => {
	return (
		<Text asElement="p" className={s.root} size={300} weight="medium">
			No results match your search.
		</Text>
	)
}

export default NoResultsMessage
