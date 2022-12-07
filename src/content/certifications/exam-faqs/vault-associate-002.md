## Overview

This file holds some markdown content, that gets its newlines removed and then gets pasted into the adjacent `infrastructure-automation.json` file.

This is a stopgap while we figure out better content authoring interfaces for this content.

> **Thought**: we could parse this markdown file with remark, extracting content under each `<h2 />` heading, in order to drive the FAQ.
> This would be an alternative to driving the FAQ content via JSON. Might be neat to explore.

## Prerequisites

- Basic terminal skills
- Basic understanding of on premise or cloud architecture
- Basic level of security understanding

## Product Version Tested

Vault 1.6.0 and higher.

## Preparing for the Exam

The Vault Associate exam has both a study guide and a review guide. While much of the information in these two guides are the same, they are presented differently for different uses.

- Use the [study guide](https://learn.hashicorp.com/tutorials/vault/associate-study) if you want to study all the exam objectives.
- Use the [review guide](https://learn.hashicorp.com/tutorials/vault/associate-review) if you already have Vault experience and/or training and want to pick and choose which objectives to review before taking the exam.

There are also [sample questions](https://learn.hashicorp.com/tutorials/vault/associate-questions) available so you can get a feel for what the exam will be like.

## Exam Details

|                     |                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------- |
| **Assessment Type** | Multiple choice                                                                    |
| **Format**          | Online proctored                                                                   |
| **Duration**        | 1 hour                                                                             |
| **Price**           | $ 70.50 USD, plus locally applicable taxes and fees. Free retake **not included**. |
| **Language**        | English                                                                            |
| **Expiration**      | 2 years                                                                            |

## Exam Objectives

| 1   | Compare authentication methods                    |
| --- | ------------------------------------------------- |
| 1a  | Describe authentication methods                   |
| 1b  | Choose an authentication method based on use case |
| 1c  | Differentiate human vs. system auth methods       |

| 2   | Create Vault policies                      |
| --- | ------------------------------------------ |
| 2a  | Illustrate the value of Vault policy       |
| 2b  | Describe Vault policy syntax: path         |
| 2c  | Describe Vault policy syntax: capabilities |
| 2d  | Craft a Vault policy based on requirements |

| 3   | Assess Vault tokens                                                          |
| --- | ---------------------------------------------------------------------------- |
| 3a  | Describe Vault token                                                         |
| 3b  | Differentiate between service and batch tokens. Choose one based on use-case |
| 3c  | Describe root token uses and lifecycle                                       |
| 3d  | Define token accessors                                                       |
| 3e  | Explain time-to-live                                                         |
| 3f  | Explain orphaned tokens                                                      |
| 3g  | Create tokens based on need                                                  |

| 4   | Manage Vault leases               |
| --- | --------------------------------- |
| 4a  | Explain the purpose of a lease ID |
| 4b  | Renew leases                      |
| 4c  | Revoke leases                     |

| 5   | Compare and configure Vault secrets engines                     |
| --- | --------------------------------------------------------------- |
| 5a  | Choose a secret method based on use case                        |
| 5b  | Contrast dynamic secrets vs. static secrets and their use cases |
| 5c  | Define transit engine                                           |
| 5d  | Define secrets engines                                          |

| 6   | Utilize Vault CLI                |
| --- | -------------------------------- |
| 6a  | Authenticate to Vault            |
| 6b  | Configure authentication methods |
| 6c  | Configure Vault policies         |
| 6d  | Access Vault secrets             |
| 6e  | Enable Secret engines            |
| 6f  | Configure environment variables  |

| 7   | Utilize Vault UI                 |
| --- | -------------------------------- |
| 7a  | Authenticate to Vault            |
| 7b  | Configure authentication methods |
| 7c  | Configure Vault policies         |
| 7d  | Access Vault secrets             |
| 7e  | Enable Secret engines            |

| 8   | Be aware of the Vault API      |
| --- | ------------------------------ |
| 8a  | Authenticate to Vault via Curl |
| 8b  | Access Vault secrets via Curl  |

| 9   | Explain Vault architecture                                      |
| --- | --------------------------------------------------------------- |
| 9a  | Describe the encryption of data stored by Vault                 |
| 9b  | Describe cluster strategy                                       |
| 9c  | Describe storage backends                                       |
| 9d  | Describe the Vault agent                                        |
| 9e  | Describe secrets caching                                        |
| 9f  | Be aware of identities and groups                               |
| 9g  | Describe Shamir secret sharing and unsealing                    |
| 9h  | Be aware of replication                                         |
| 9i  | Describe seal/unseal                                            |
| 9j  | Explain response wrapping                                       |
| 9k  | Explain the value of short-lived, dynamically generated secrets |

| 10  | Explain encryption as a service |
| --- | ------------------------------- |
| 10a | Configure transit secret engine |
| 10b | Encrypt and decrypt secrets     |
| 10c | Rotate the encryption key       |
