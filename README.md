## Description

PXU backend api

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Running the Listener

```bash
# run
$ npx nestjs-command listener:run

# or using pm2

$ pm2 start ./pm2-listener.config.js

```

## deploy or run cronjob for every Vault

```bash
# run
$ npx nestjs-command cloneCronJob:run

# or using pm2 (replace VOX with appropriate gameType)
$ type=VOX pm2 start ./pm2-cronjob.config.js
```


## deploy or run getTotalStake cronjob

```bash
# run
$ npx nestjs-command getTotalStake:run

# or using pm2
$ pm2 start ./pm2-total-stake.config.js
```

## deploy project with pm2
```bash

# build project
$ npm run build

# run project using pm2
$ pm2 start dist/main.js --name PXU-V2
```
