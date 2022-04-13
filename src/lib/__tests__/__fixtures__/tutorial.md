---
id: 1c307f3e-1bef-4bb1-a67f-d0d006f01677
name: Debugging and UI
read_time: 10
description: 'Exec into a container, view logs, and use the web UI.'
products_used:
  - waypoint
default_collection_context: waypoint/get-started-docker
---

Waypoint includes several commands to support debugging and monitoring while
developing your application.

## Test Links

[link to other waypoint tutorial](/tutorials/waypoint/get-started-ui)

[link to non beta product](/tutorials/terraform/install-cli)

[collections link](/collections/vault/cloud)

[collection non beta link](/collections/consul/cloud-production)

## Exec into the application container

Now that you have deployed your application, you can use `waypoint exec` to run
commands in the context of the most recent deployment. Typically, `waypoint exec` will be used for running database migrations and debugging. However, you
can use it for any purpose.

Use the `exec` command to open a shell prompt.

```shell-session
$ waypoint exec /bin/bash
```

Since you are in the deployment directory, you will observe that Waypoint
automatically executes against the currently deployed application.

From within the Docker container, validate that this is the actual application
by listing out the directory hosting the application's compiled files.

```shell-session
$ cd / && ls
```

You should observe an output that contains the file structure for the current
deployment.

List the processes that are running in the container.

```shell-session
$ ps aux
```

Type `exit` to leave the interactive Docker session.

```shell-session
$ exit
```

## View Waypoint application logs

In the application's directory, run the `logs` command to observe the running
logs for your deployment.

```shell-session
$ waypoint logs
```

You will observe output similar to the following. These logs are from the
existing deployment.

```plaintext
2020-09-24T06:20:18.162Z 2MGFF4:
2020-09-24T06:20:18.163Z 2MGFF4: > node-js-getting-started@0.3.0 start /workspace
2020-09-24T06:20:18.163Z 2MGFF4: > node index.js
2020-09-24T06:20:18.163Z 2MGFF4:
2020-09-24T06:20:18.383Z 2MGFF4: Listening on 3000
```

~> **NOTE**: Waypoint currently uses self-signed certificates for TLS. Your web
browser will require you to bypass a certificate warning to use the UI.

Review the application metadata and associated operations and logs in the browser.

![Waypoint UI](/img/waypoint/get-started/admin-ui.png)
