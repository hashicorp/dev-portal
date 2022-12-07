## Overview

This file holds some markdown content, that gets its newlines removed and then gets pasted into the adjacent `infrastructure-automation.json` file.

This is a stopgap while we figure out better content authoring interfaces for this content.

> **Thought**: we could parse this markdown file with remark, extracting content under each `<h2 />` heading, in order to drive the FAQ.
> This would be an alternative to driving the FAQ content via JSON. Might be neat to explore.

## Prerequisites

- Containerization knowledge
- Basic terminal skills
- Networking skills including load balancing and distributed systems
- Understand the purpose of ACLs
- Experience with TLS certificate lifecycle

## Product Version Tested

Consul 1.8 or higher.

## Preparing for the Exam

You will be tested based on the objectives below.

The Consul Associate exam has both a study guide and a review guide. While much of the information in these two guides are the same, they are presented differently for different uses.

- Use the [study guide](https://learn.hashicorp.com/tutorials/consul/associate-study) if you want to study all the exam objectives.
- Use the [review guide](https://learn.hashicorp.com/tutorials/consul/associate-review) if you already have Consul experience and/or training and want to pick and choose which objectives to review before taking the exam.

There are also [sample questions](https://learn.hashicorp.com/tutorials/consul/associate-questions) available so you can get a feel for what the exam will be like.

## Exam Details

|                     |                                                                                   |
| ------------------- | --------------------------------------------------------------------------------- |
| **Assessment Type** | Multiple choice                                                                   |
| **Format**          | Online proctored                                                                  |
| **Duration**        | 1 hour                                                                            |
| **Price**           | $70.50 USD, plus locally applicable taxes and fees. Free retake **not included**. |
| **Language**        | English                                                                           |
| **Expiration**      | 2 years                                                                           |

## Exam Objectives

| 1   | Explain Consul architecture                                                                |
| --- | ------------------------------------------------------------------------------------------ |
| 1a  | Identify the components of Consul datacenter, including agents and communication protocols |
| 1b  | Prepare Consul for high availability and performance                                       |
| 1c  | Identify Consul's core functionality                                                       |
| 1d  | Differentiate agent roles                                                                  |

| 2   | Deploy a single datacenter                            |
| --- | ----------------------------------------------------- |
| 2a  | Start and manage the Consul process                   |
| 2b  | Interpret a Consul agent configuration                |
| 2c  | Configure Consul network addresses and ports          |
| 2d  | Describe and configure agent join and leave behaviors |

| 3   | Register services and use service discovery                                                    |
| --- | ---------------------------------------------------------------------------------------------- |
| 3a  | Interpret a service registration                                                               |
| 3b  | Differentiate ways to register a single service                                                |
| 3c  | Interpret a service configuration with health check                                            |
| 3d  | Check the service catalog status from the output of the DNS/API interface or via the Consul UI |
| 3e  | Interpret a prepared query                                                                     |
| 3f  | Use a prepared query                                                                           |

| 4   | Access the Consul key/value (KV)                            |
| --- | ----------------------------------------------------------- |
| 4a  | Understand the capabilities and limitations of the KV store |
| 4b  | Interact with the KV store using both the Consul CLI and UI |
| 4c  | Monitor KV changes using `watch`                            |
| 4d  | Monitor KV changes using `envconsul` and `consul-template`  |

| 5   | Back up and restore                                             |
| --- | --------------------------------------------------------------- |
| 5a  | Describe the content of a snapshot                              |
| 5b  | Back up and restore the datacenter                              |
| 5c  | \[Enterprise\] Describe the benefits of snapshot agent features |

| 6   | Use Consul service mesh                                        |
| --- | -------------------------------------------------------------- |
| 6a  | Understand Consul Connect service mesh high level architecture |
| 6b  | Describe configuration for registering a service proxy         |
| 6c  | Describe intentions for Consul Connect service mesh            |
| 6d  | Check intentions in both the Consul CLI and UI                 |

| 7   | Secure agent communication                                                     |
| --- | ------------------------------------------------------------------------------ |
| 7a  | Understanding Consul security/threat model                                     |
| 7b  | Differentiate certificate types needed for TLS encryption                      |
| 7c  | Understand the different TLS encryption settings for a fully secure datacenter |

| 8   | Secure services with basic access control lists (ACL)                                    |
| --- | ---------------------------------------------------------------------------------------- |
| 8a  | Set up and configure a basic ACL system                                                  |
| 8b  | Create policies                                                                          |
| 8c  | Manage token lifecycle: multiple policies, token revoking, ACL roles, service identities |
| 8d  | Perform a CLI request using a token                                                      |
| 8e  | Perform an API request using a token                                                     |

| 9   | Use gossip encryption                                    |
| --- | -------------------------------------------------------- |
| 9a  | Understanding the Consul security/threat model           |
| 9b  | Configure gossip encryption for the existing data center |
| 9c  | Manage the lifecycle of encryption keys                  |
