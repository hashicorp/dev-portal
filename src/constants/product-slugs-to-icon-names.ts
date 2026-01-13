import type { FlightIconName } from "@hashicorp/mds-react/components";
import type { ProductSlug } from "types/products";

export const PRODUCT_SLUGS_TO_ICON_NAMES: Record<ProductSlug | 'hcp-vault-secrets' | 'hcp-vault-radar', FlightIconName> = {
	boundary: 'boundary-color',
	consul: 'consul-color',
	hcp: 'hcp',
	nomad: 'nomad-color',
	packer: 'packer-color',
	terraform: 'terraform-color',
	vagrant: 'vagrant-color',
	vault: 'vault-color',
	'hcp-vault-radar': 'vault-radar-square-color',
	'hcp-vault-secrets': 'vault-secrets-square-color',
	waypoint: 'waypoint-color',
	sentinel: 'hcp',
	'well-architected-framework': 'hcp',
}