FROM node:18.12

WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libnss3-tools \
    golang-go \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

RUN git clone https://github.com/FiloSottile/mkcert /tmp/mkcert && \
    cd /tmp/mkcert && \
    go build -ldflags "-X main.Version=$(git describe --tags)" \
    && mv mkcert /usr/bin/ \
    && rm -rf /tmp/*

CMD ["sleep", "infinity"]