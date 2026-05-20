FROM mcr.microsoft.com/playwright:v1.57.0

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
    && rm -rf /var/lib/apt/lists/* \
    && if getent passwd 1000 >/dev/null; then \
           existing_user="$(getent passwd 1000 | cut -d: -f1)"; \
           existing_group="$(getent group 1000 | cut -d: -f1)"; \
           [ "$existing_user" != "node" ] && usermod -l node -d /home/node -m "$existing_user"; \
           [ -n "$existing_group" ] && [ "$existing_group" != "node" ] && groupmod -n node "$existing_group"; \
       else \
           groupadd --gid 1000 node && useradd --uid 1000 --gid node --shell /bin/bash --create-home node; \
       fi \
    && echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN corepack enable \
    && corepack prepare pnpm@11.0.8 --activate

RUN npm install -g @anthropic-ai/claude-code

WORKDIR /workspace

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV SHELL=/usr/bin/zsh

CMD ["sleep", "infinity"]
