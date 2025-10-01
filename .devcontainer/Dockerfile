# Use the official Node.js image as a parent image
FROM mcr.microsoft.com/devcontainers/typescript-node:24

# Add a label to name your image
LABEL name="relabeler-dev"

# Set environment variables for versions
# Debian version should be the same as the base image.
ENV DEBIAN_VERSION=12
ENV DOTNET_SDK_VERSION=8.0
ENV NODE_VERSION=20

# Install additional OS packages and .NET SDK
# hadolint ignore=DL3008
RUN wget --progress=dot:giga https://packages.microsoft.com/config/debian/$DEBIAN_VERSION/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && rm packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
    dotnet-sdk-$DOTNET_SDK_VERSION \
    git \
    apt-transport-https \
    curl \
    wget \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install n package manager and use it to install the latest Node.js and npm
RUN npm install -g n@latest && n $NODE_VERSION \
    && npm install -g npm@latest

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]

# Switch to the node user
USER node
WORKDIR /home/node

# Install GitVersion as a dotnet tool for the node user
RUN dotnet tool install --global GitVersion.Tool

# Add alias for gitversion, ensuring a newline before the alias
RUN printf "\nalias gitversion=\"dotnet-gitversion\"\n" >> /home/node/.bashrc

# Switch back to root user to install global npm packages
#USER root
