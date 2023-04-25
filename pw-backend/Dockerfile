FROM debian:bullseye as builder

ENV PATH=/usr/local/node/bin:$PATH
ARG NODE_VERSION=19.5.0

RUN apt-get update; apt install -y curl pkg-config build-essential && \
    curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
rm -rf /tmp/node-build-master

ENV PATH="/usr/local/node/bin:$PATH" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN mkdir /app
WORKDIR /app

COPY . .

ENV npm_config_cache /app/.npm

RUN npm install

FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install --no-install-recommends -y chromium chromium-sandbox libsqlite3-0 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /usr/local/node /usr/local/node
COPY --from=builder /app /app

# Create a non-root user and set the home directory and shell
RUN useradd -m -d /app -s /bin/bash myuser
USER myuser
WORKDIR /app

ENV NODE_ENV production
ENV PATH /usr/local/node/bin:$PATH
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
ENV PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage"

CMD [ "npm", "run", "start" ]
