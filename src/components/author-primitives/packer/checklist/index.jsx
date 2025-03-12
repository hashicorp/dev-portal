/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'
import PropTypes from 'prop-types'

export default function ChecklistWrapper({ children }) {
	return <div className={s.root}>{children}</div>
}

ChecklistWrapper.propTypes = {
	children: PropTypes.node
}