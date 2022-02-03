FROM --platform=linux/amd64 docker.mirror.hashicorp.services/node:14.17.0-alpine AS deps

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
RUN npm install

FROM docker.mirror.hashicorp.services/node:14.17.0-alpine AS builder
WORKDIR /app
COPY . ./website-preview
COPY --from=deps /app/node_modules ./website-preview/node_modules

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["cd website-preview && ./scripts/content-repo-preview/start.sh"]
