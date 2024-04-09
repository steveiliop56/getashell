FROM node:21.7-alpine as node_base

# ---- BUILDER BASE ----
FROM node_base as builder_base

RUN apk add --no-cache tar wget

# ---- BUILD APP ----
FROM builder_base as builder

ARG DOCKER_VERSION="25.0.5"
ARG BUILDX_VERSION="0.13.1"
ARG TARGETARCH
ENV DOCKER_VERSION=${DOCKER_VERSION}
ENV TARGETARCH=${TARGETARCH}
ENV BUILDX_VERSION=${BUILDX_VERSION}

RUN if [ "${TARGETARCH}" = "amd64" ]; then \
  wget -O docker-bundle.tgz "https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz"; \
  elif [ "${TARGETARCH}" = "arm64" ]; then \
  wget -O docker-bundle.tgz "https://download.docker.com/linux/static/stable/aarch64/docker-${DOCKER_VERSION}.tgz"; \
  else \
  echo "Unsupported architecture"; \
  fi

RUN tar xzvf docker-bundle.tgz

RUN chmod +x docker/docker

RUN if [ "${TARGETARCH}" = "amd64" ]; then \
  wget -O docker-buildx "https://github.com/docker/buildx/releases/download/v${BUILDX_VERSION}/buildx-v${BUILDX_VERSION}.linux-amd64"; \
  elif [ "${TARGETARCH}" = "arm64" ]; then \
  wget -O docker-buildx "https://github.com/docker/buildx/releases/download/v${BUILDX_VERSION}/buildx-v${BUILDX_VERSION}.linux-arm64"; \
  else \
  echo "Unsupported architecture"; \
  fi

RUN chmod +x docker-buildx

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json ./
COPY ./next.config.mjs ./
COPY ./postcss.config.js ./
COPY ./tailwind.config.ts ./
COPY ./migrations ./migrations
COPY ./distros.json ./distros.json
COPY ./.env.prod ./.env

RUN npm run build

# ---- RUN APP ----
FROM node_base as app

WORKDIR /app

COPY --from=builder /docker-buildx /usr/lib/docker/cli-plugins/docker-buildx
COPY --from=builder /docker/docker /usr/bin/docker
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY ./migrations ./migrations
COPY ./.env.prod ./.env
COPY ./distros.json ./
COPY ./dockerfiles ./dockerfiles

EXPOSE 3000

CMD ["node", "server.js"]


