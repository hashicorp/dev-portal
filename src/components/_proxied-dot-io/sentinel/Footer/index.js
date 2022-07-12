import HashicorpLogoSvg from '@hashicorp/mktg-logos/corporate/hashicorp/primary/white.svg?include'
import ConsulLogo from '@hashicorp/mktg-logos/product/consul/primary/colorwhite.svg?include'
import TerraformLogo from '@hashicorp/mktg-logos/product/terraform/primary/colorwhite.svg?include'
import NomadLogo from '@hashicorp/mktg-logos/product/nomad/primary/colorwhite.svg?include'
import VaultLogo from '@hashicorp/mktg-logos/product/vault/primary/colorwhite.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'

import NewsletterSignupForm from 'components/_proxied-dot-io/sentinel/NewsletterSignupForm'
import IconFacebook from './social/icon-facebook'
import IconGithub from './social/icon-github'
import IconLinkedIn from './social/icon-linkedin'
import IconMeetup from './social/icon-meetup'
import IconTwitter from './social/icon-twitter'
import IconYouTube from './social/icon-youtube'

/**
 * Localized from hashicorp.com 04.06.21
 */

function Footer({ openConsentManager, showSignupForm }) {
  return (
    <footer className="g-footer_sentinel">
      <div className="g-grid-container">
        {showSignupForm && (
          <div
            className="newsletter-section"
            data-testid="newsletterSignupForm"
          >
            <NewsletterSignupForm
              theme={{ background: 'dark' }}
              placement="footer"
            />
          </div>
        )}
        <div className="social-section">
          <InlineSvg className="hc-logo" src={HashicorpLogoSvg} />
          <ul>
            <li>
              <a
                href="https://github.com/hashicorp"
                target="_blank"
                rel="noopener noreferrer"
                title="Github"
                data-ga-footer="Social | Github"
              >
                <IconGithub />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/hashicorp"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
                data-ga-footer="Social | Twitter"
              >
                <IconTwitter />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/HashiCorp"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                data-ga-footer="Social | YouTube"
              >
                <IconYouTube />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/hashicorp/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                data-ga-footer="Social | LinkedIn"
              >
                <IconLinkedIn />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/HashiCorp/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                data-ga-footer="Social | Facebook"
              >
                <IconFacebook />
              </a>
            </li>
            <li>
              <a
                href="https://www.meetup.com/pro/hugs"
                target="_blank"
                rel="noopener noreferrer"
                title="Meetup"
                data-ga-footer="Social | Meetup"
              >
                <IconMeetup />
              </a>
            </li>
          </ul>
        </div>
        <div className="primary-section">
          <div className="solutions">
            <ul>
              <li>
                <a
                  href="https://www.hashicorp.com/products/terraform"
                  data-ga-footer="Solutions | Terraform"
                >
                  <span className="label">Provision</span>
                  <span className="solution">Multi-Cloud Infrastructure</span>
                  <InlineSvg className="product-icon" src={TerraformLogo} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/products/vault"
                  data-ga-footer="Solutions | Vault"
                >
                  <span className="label">Secure</span>
                  <span className="solution">Multi-Cloud Security</span>
                  <InlineSvg className="product-icon" src={VaultLogo} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/products/consul"
                  data-ga-footer="Solutions | Consul"
                >
                  <span className="label">Connect</span>
                  <span className="solution">Multi-Cloud Networking</span>
                  <InlineSvg className="product-icon" src={ConsulLogo} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/products/nomad"
                  data-ga-footer="Solutions | Nomad"
                >
                  <span className="label">Run</span>
                  <span className="solution">Multi-Cloud Orchestration</span>
                  <InlineSvg className="product-icon" src={NomadLogo} />
                </a>
              </li>
            </ul>
          </div>
          <div className="link-list">
            <span className="label">Products</span>
            <ul>
              <li>
                <a
                  href="https://www.hashicorp.com/products/terraform"
                  data-ga-footer="Products | Terraform"
                >
                  Terraform
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/products/vault"
                  data-ga-footer="Products | Vault"
                >
                  Vault
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/products/consul"
                  data-ga-footer="Products | Consul"
                >
                  Consul
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/products/nomad"
                  data-ga-footer="Products | Nomad"
                >
                  Nomad
                </a>
              </li>
              <li>
                <a
                  href="https://www.vagrantup.com/"
                  data-ga-footer="Products | Vagrant"
                >
                  Vagrant
                </a>
              </li>
              <li>
                <a
                  href="https://www.packer.io/"
                  data-ga-footer="Products | Packer"
                >
                  Packer
                </a>
              </li>
              <li>
                <a
                  href="https://www.boundaryproject.io/"
                  data-ga-footer="Products | Boundary"
                >
                  Boundary <span className="tag">NEW</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.waypointproject.io/"
                  data-ga-footer="Products | Waypoint"
                >
                  Waypoint <span className="tag">NEW</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/sentinel"
                  data-ga-footer="Products | Sentinel"
                >
                  Sentinel
                </a>
              </li>
            </ul>
          </div>
          <div className="link-list">
            <span className="label">Resources</span>
            <ul>
              <li>
                <a
                  href="https://www.hashicorp.com/blog"
                  data-ga-footer="Resources | Blog"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="https://learn.hashicorp.com"
                  data-ga-footer="Resources | Tutorials"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/community/"
                  data-ga-footer="Resources | Community"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/events"
                  data-ga-footer="Resources | Events"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/integrations"
                  data-ga-footer="Resources | Integrations"
                >
                  Integrations
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/resources"
                  data-ga-footer="Resources | Library"
                >
                  Library
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/ecosystem"
                  data-ga-footer="Resources | Partners"
                >
                  Partners
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/resources?content_type=HashiCast"
                  data-ga-footer="Resources | Podcast"
                >
                  Podcast
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/customer-success"
                  data-ga-footer="Resources | Support"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/training"
                  data-ga-footer="Resources | Training"
                >
                  Training
                </a>
              </li>
            </ul>
          </div>
          <div className="link-list">
            <span className="label">Company</span>
            <ul>
              <li>
                <a
                  href="https://www.hashicorp.com/about"
                  data-ga-footer="Company | About Us"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/jobs"
                  data-ga-footer="Company | Jobs"
                >
                  Jobs<span className="tag">We&apos;re Hiring</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/press"
                  data-ga-footer="Company | Press Center"
                >
                  Press Center
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/brand"
                  data-ga-footer="Company | Brand"
                >
                  Brand
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashicorp.com/contact"
                  data-ga-footer="Company | Contact Us"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="secondary-section">
          <ul>
            <li>
              <a
                href="https://status.hashicorp.com/"
                data-ga-footer="Bottom | System Status"
              >
                System Status
              </a>
            </li>
            {openConsentManager && (
              <li>
                <a
                  className="consent-manager"
                  data-testid="consentManager"
                  data-ga-footer="Bottom | Cookie Manager"
                  onClick={openConsentManager}
                >
                  Cookie Manager
                </a>
              </li>
            )}
          </ul>
          <ul>
            <li>
              <a
                href="https://www.hashicorp.com/terms-of-service"
                data-ga-footer="Bottom | Terms of Use"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href="https://www.hashicorp.com/security"
                data-ga-footer="Bottom | Security"
              >
                Security
              </a>
            </li>
            <li>
              <a
                href="https://www.hashicorp.com/privacy"
                data-ga-footer="Bottom | Privacy"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="https://www.hashicorp.com/trademark-policy"
                data-ga-footer="Bottom | Trademark Policy"
              >
                Trademark Policy
              </a>
            </li>
          </ul>
        </div>
        <span
          className="not-a-bug"
          data-text="This is not a bug on the website, but rather an inside joke
          for some of our oldest customers."
          title="No, this is not a bug"
        >
          stdin: is not a tty
        </span>
      </div>
    </footer>
  )
}

Footer.defaultProps = {
  showSignupForm: true,
}

export default Footer
