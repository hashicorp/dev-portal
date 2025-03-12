/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'
import PropTypes from 'prop-types'

export default function Columns({ count = 1, children }) {
	return <div className={`${s.root} ${s['count-' + count]}`}>{children}</div>
}

Columns.propTypes = {
	count: PropTypes.number,
	children: PropTypes.node,
}