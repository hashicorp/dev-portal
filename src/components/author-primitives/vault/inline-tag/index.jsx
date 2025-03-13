/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'
import PropTypes from 'prop-types'

export default function InlineTag({ title, color }) {
	return <span className={`${s.root} ${s[color]}`}>{title}</span>
}

InlineTag.propTypes = {
	title: PropTypes.string,
	color: PropTypes.string,
}