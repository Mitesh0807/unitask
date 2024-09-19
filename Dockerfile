FROM node:20

WORKDIR /usr/src/app

RUN  npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install

COPY . .
RUN pnpm run build


# Start the app with pnpm
CMD [ "pnpm", "run", "start:prod"]
