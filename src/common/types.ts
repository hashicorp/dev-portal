export type ProductSlug =
  | 'boundary'
  | 'consul'
  | 'hcp'
  | 'nomad'
  | 'packer'
  | 'sentinel'
  | 'terraform'
  | 'vagrant'
  | 'vault'
  | 'waypoint'

export type ProductName =
  | 'Boundary'
  | 'Consul'
  | 'HashiCorp Cloud Platform'
  | 'Nomad'
  | 'Packer'
  | 'Sentinel'
  | 'Terraform'
  | 'Vagrant'
  | 'Vault'
  | 'Waypoint'

export interface Product {
  name: ProductName
  code: ProductSlug
  url: string
}
