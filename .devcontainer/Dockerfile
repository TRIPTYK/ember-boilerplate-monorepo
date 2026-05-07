FROM node:24.15.0-bookworm

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        build-essential \
        python3 \
        postgresql-client \
        ca-certificates \
        curl \
        wget \
        jq \
        procps \
        less \
        nano \
        vim-tiny \
        openssh-client \
        sudo \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable \
    && corepack prepare pnpm@11.0.8 --activate

RUN npm install -g @anthropic-ai/claude-code

RUN mkdir -p \
        /workspace/node_modules \
        /workspace/.turbo \
        /workspace/@apps/backend/node_modules \
        /workspace/@apps/e2e/node_modules \
        /workspace/@apps/front/node_modules \
        /workspace/@libs/backend-shared/node_modules \
        /workspace/@libs/invoices-backend/node_modules \
        /workspace/@libs/invoices-front/node_modules \
        /workspace/@libs/repo-utils/node_modules \
        /workspace/@libs/shared-front/node_modules \
        /workspace/@libs/test-lib-backend/node_modules \
        /workspace/@libs/todos-backend/node_modules \
        /workspace/@libs/todos-front/node_modules \
        /workspace/@libs/users-backend/node_modules \
        /workspace/@libs/users-front/node_modules \
        /home/node/.local/share/pnpm/store \
    && chown -R node:node /workspace /home/node

USER node
WORKDIR /workspace

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV SHELL=/bin/bash

CMD ["sleep", "infinity"]
