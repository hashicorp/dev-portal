# 2022-11-10 - static props updates before and after

| View                              | ~ kB Before | ~ kB After | Shows Sitemap |
| :-------------------------------- | ----------: | ---------: | ------------- |
| [/hcp/tutorials][hcp]             |        76.3 |        9.8 | No            |
| [/terraform/tutorials][terraform] |       167.9 |       61.4 | Yes           |
| [/packer/tutorials][packer]       |        27.9 |       10.4 | Yes           |
| [/consul/tutorials][consul]       |        64.5 |       44.2 | Yes           |
| [/vault/tutorials][vault]         |       139.4 |       51.9 | Yes           |
| [/boundary/tutorials][boundary]   |        46.7 |        6.6 | No            |
| [/nomad/tutorials][nomad]         |        62.1 |       27.6 | Yes           |
| [/waypoint/tutorials][waypoint]   |        25.0 |       11.1 | Yes           |
| [/vagrant/tutorials][vagrant]     |        18.2 |        6.1 | No            |

> **Note**: Sitemap data is already optimized (thanks to [#420](https://github.com/hashicorp/dev-portal/pull/420)). But even when optimized, some of our sitemaps are large enough that they seem to still contribute significant weight to static props.

[hcp]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/hcp/tutorials
[terraform]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/terraform/tutorials
[packer]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/packer/tutorials
[consul]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/consul/tutorials
[vault]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/vault/tutorials
[boundary]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/boundary/tutorials
[nomad]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/nomad/tutorials
[waypoint]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/waypoint/tutorials
[vagrant]: https://dev-portal-git-zstrim-product-tutorials-gsp-weight-hashicorp.vercel.app/vagrant/tutorials
