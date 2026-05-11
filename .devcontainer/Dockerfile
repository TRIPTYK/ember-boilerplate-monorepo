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
        xvfb \
        x11vnc \
        fluxbox \
        novnc \
        websockify \
    && rm -rf /var/lib/apt/lists/* \
    && echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN corepack enable \
    && corepack prepare pnpm@11.0.8 --activate

RUN npm install -g @anthropic-ai/claude-code

WORKDIR /workspace

COPY --chown=node:node . .
RUN chown -R node:node /home/node
RUN chown -R node:node /workspace

USER node

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV SHELL=/usr/bin/zsh

CMD ["sleep", "infinity"]
