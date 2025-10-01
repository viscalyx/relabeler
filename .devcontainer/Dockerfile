# Use the official Node.js image as a parent image
FROM mcr.microsoft.com/devcontainers/typescript-node:24

# Add a label to name your image
LABEL name="relabeler-dev"

# Set environment variables for versions
ENV NODE_VERSION=20

# Install n package manager and use it to install the latest Node.js and npm
RUN npm install -g n@latest && n $NODE_VERSION \
    && npm install -g npm@latest

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]

# Switch to the node user
USER node
WORKDIR /home/node

# Add alias for gitversion (GitVersion will be installed in post-create command)
RUN printf "\nalias gitversion=\"dotnet-gitversion\"\n" >> /home/node/.bashrc
