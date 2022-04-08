import { IconBoundaryColor16 } from '@hashicorp/flight-icons/svg-react/boundary-color-16'
import { IconConsulColor16 } from '@hashicorp/flight-icons/svg-react/consul-color-16'
import { IconNomadColor16 } from '@hashicorp/flight-icons/svg-react/nomad-color-16'
import { IconPackerColor16 } from '@hashicorp/flight-icons/svg-react/packer-color-16'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerraformColor16 } from '@hashicorp/flight-icons/svg-react/terraform-color-16'
import { IconVagrantColor16 } from '@hashicorp/flight-icons/svg-react/vagrant-color-16'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import { IconWaypointColor16 } from '@hashicorp/flight-icons/svg-react/waypoint-color-16'

/*
Note: this is not intended as a final solution.
This will likely be replaced or augmented using a different approach
as we continue to iterate on the card components used to render
the product view content.
*/
const tagIconDict = {
  boundary: IconBoundaryColor16,
  consul: IconConsulColor16,
  nomad: IconNomadColor16,
  packer: IconPackerColor16,
  terraform: IconTerraformColor16,
  vagrant: IconVagrantColor16,
  vault: IconVaultColor16,
  video: IconPlay16,
  waypoint: IconWaypointColor16,
}

export type TagIconKey = keyof typeof tagIconDict
export default tagIconDict
