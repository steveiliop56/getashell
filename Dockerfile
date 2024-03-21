FROM node:21.7-alpine as node_base

# ---- BUILDER BASE ----
FROM node_base as builder_base

RUN apk add --no-cache tar wget

# ---- BUILD APP ----
FROM builder_base as builder

ARG DOCKER_VERSION="25.0.5"
ARG TARGETARCH
ENV DOCKER_VERSION=${DOCKER_VERSION}
ENV TARGETARCH=${TARGETARCH}

RUN if [ "${TARGETARCH}" = "amd64" ]; then \
  wget -O docker-bundle.tgz "https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz"; \
  elif [ "${TARGETARCH}" = "arm64" ]; then \
  wget -O docker-bundle.tgz "https://download.docker.com/linux/static/stable/aarch64/docker-${DOCKER_VERSION}.tgz"; \
  else \
  echo "Unsupported architecture"; \
  fi

RUN tar xzvf docker-bundle.tgz

RUN chmod +x docker/docker

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
COPY ./drizzle.config.build.json ./drizzle.config.json
COPY ./migrations ./migartions

RUN npm run migrate
RUN npm run build

# ---- RUN APP ----
FROM node_base as app

WORKDIR /app

COPY --from=builder /docker/docker /usr/bin/docker
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/sqlite.db ./

EXPOSE 3000

CMD ["node", "server.js"]


