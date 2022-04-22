export enum CompanyLogoOption {
  docker = 'docker',
  github = 'github',
  'microsoft-azure' = 'microsoft-azure',
  oci = 'oci',
  'google-cloud' = 'google-cloud',
  'terraform-cloud' = 'terraform-cloud',
  aws = 'aws',
}

export interface CompanyLogoProps {
  name: CompanyLogoOption
}
