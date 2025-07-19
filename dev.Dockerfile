FROM mcr.microsoft.com/playwright:v1.54.1-noble AS base
ARG DOCKER_USER
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY --chown=$DOCKER_USER . /app
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM build
COPY --from=build /app/node_modules /app/node_modules

RUN corepack install
RUN pnpm install
RUN pnpm playwright install
