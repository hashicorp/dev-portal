/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Card } from "@hashicorp/mds-react/components"
import classNames from "classnames"
import { MDSCardProps } from "./types"
import s from "./mds-card.module.css"
import { ReactElement } from "react"

export const MDSCard = ({ children, className, isLightBackground = false }: MDSCardProps): ReactElement => {
    const cardClassName = classNames(className, {
        [s.lightBackground]: isLightBackground,
    })
    return <Card className={cardClassName}>{children}</Card>
}