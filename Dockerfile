FROM docker.mirror.hashicorp.services/node:16-alpine AS deps

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
RUN npm install -g npm@latest

# While imagemin/optipng-bin doesn't support arm64, set this env var as a workaround
# - `npm ls imagemin`
# - see https://github.com/imagemin/optipng-bin/issues/118
RUN CPPFLAGS="-DPNG_ARM_NEON_OPT=0" npm install

FROM docker.mirror.hashicorp.services/node:16-alpine AS builder

RUN npm install -g npm@latest

WORKDIR /app
COPY . ./website-preview
COPY --from=deps /app/node_modules ./website-preview/node_modules

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["cd website-preview && ./scripts/content-repo-preview/start.sh"]
