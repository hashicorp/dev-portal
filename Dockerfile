# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

FROM docker.mirror.hashicorp.services/node:18.18.2-alpine AS deps

RUN apk add --update --no-cache \
	autoconf \
	automake \
	bash \
	git \
	g++ \
	libtool \
	libc6-compat \
	libjpeg-turbo-dev \
	libpng-dev \
	make \
	nasm

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@9.8.1

# While imagemin/optipng-bin doesn't support arm64, set this env var as a workaround
# - `npm ls imagemin`
# - see https://github.com/imagemin/optipng-bin/issues/118
RUN CPPFLAGS="-DPNG_ARM_NEON_OPT=0" npm install

FROM docker.mirror.hashicorp.services/node:18-alpine AS builder

RUN npm install -g npm@9.8.1

WORKDIR /app
COPY . ./website-preview
COPY --chown=0:0 --from=deps /app/node_modules ./website-preview/node_modules

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["cd website-preview && ./scripts/content-repo-preview/start.sh"]
