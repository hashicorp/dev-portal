import BaseNewLayout from 'layouts/base-new'
import { ReactElement } from 'react'

const VaultDownloadsPage = (): ReactElement => {
  return (
    <div className="g-grid-container">
      <h1>Vault Downloads</h1>
      <ul>
        <li>This page is a work in progress</li>
      </ul>
    </div>
  )
}

VaultDownloadsPage.layout = BaseNewLayout
export default VaultDownloadsPage
