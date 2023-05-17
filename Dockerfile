
FROM node:18.14.1-bullseye

# add Github to known hosts inside the container
RUN mkdir -p -m 0700 /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN npm install -g live-server typescript ts-node

WORKDIR /app

ENTRYPOINT [ "/bin/bash" ] 