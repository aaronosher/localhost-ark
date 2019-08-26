# Ark Taco Shop

## Requirements

Make sure you’ve got a recent version of:

- [Node.js](https://nodejs.org/) - We suggest using [NVM](https://github.com/creationix/nvm) to handle it
- [Docker and Docker-Compose](https://www.docker.com/) - We use docker to run our database. You can skip it if you have [Postgres](https://www.postgresql.org/) installed locally.
- [Yarn](https://yarnpkg.com/en/) - Fast, Reliable, and secure dependency management.
- [Lerna](https://lernajs.io/) - A tool for managing JavaScript projects with multiple packages.
- [ARK Desktop Wallet](https://github.com/ArkEcosystem/desktop-wallet/releases) - ARK Desktop Wallets to see the transactions

## Installation

To begin, create a root folder to contain the ark core and the ark-taco-shop components.

```sh
cd ~
git clone https://github.com/ArkEcosystem/core.git
cd core
git fetch https://github.com/arkecosystem/core 2.5.1:2.5.1
git checkout 2.5.1
yarn setup
yarn docker ark
```

### Database

We will use ARK core's docker files to make it easier to create/manage the database. If you prefer to use postgres directly, skip the section below and create a new database called `ark_testnet`.

##### Creating database using docker

```sh
cd ~/core/docker/development/testnet
docker-compose up -d postgres
```

If you need to remove it, you can run the following:

```sh
cd ~/core/docker/development/testnet
docker-compose down -v
```

### Ark Taco Shop Plugins

Clone the `MLH/localhost-ark` repository:

```sh
cd ~/core/plugins
git clone https://github.com/MLH/localhost-ark
```

This repository contains two different plugins:

- _ark-taco-shop-api_ - the server plugin, that provides backend capabilities and integrates with ARK's blockchain
- _ark-taco-shop_ - the client plugin, that provides frontend capabilities and integrates with _ark-taco-shop-api_

#### The server - Ark Taco Shop Api

To install the server, copy the `ark-taco-shop-api` plugin to the ARK core's `plugins` folder:

```sh
cd ~/core/plugins
mv ./localhost-ark/ark-taco-shop-api ./
```

##### Configuration

We will be using `testnet` as a local network to run ARK. To configure it, modify the file `core/packages/core/bin/config/testnet/plugins.js` and copy the contents of the configuration object from the file `localhost-ark/ark-taco-shop-api/src/defaults.ts`, and append it to the `plugins.js` file, like showed below:

```js
{
  '@arkecosystem/core-event-emitter': {},
  '@arkecosystem/core-config': {},
  ...
  },
  '@mlh/ark-taco-shop-api': {
    enabled: process.env.ARK_INVENTORY_API_ENABLED || true,
    server: {
        enabled: process.env.ARK_INVENTORY_API_SERVER_ENABLED || true,
        host: process.env.ARK_INVENTORY_API_SERVER_HOST || "0.0.0.0",
        port: process.env.ARK_INVENTORY_API_SERVER_PORT || 5000,
    },
  }
}
```

Make sure to change the `database` properties to use the database configs you have set up before.

##### Install dependencies

```sh
cd ~/core
yarn setup
```

##### Run the application

```sh
cd ~/core/packages/core
yarn full:testnet
```

The output may be a bit verbose, but you should see the message `ark-taco-shop-api available and listening on http://0.0.0.0:5000` in it.

To test it, make sure the url http://0.0.0.0:5000/api/taco/products returns a valid json, like the one below:

```js
{
  "results": [],
  "totalCount": 0
}
```

##### Add products to inventory

Access http://0.0.0.0:5000/inventory and use the form to submit a csv. It expects the following format:

```csv
PRODUCT_CODE1,PRODUCT_NAME1,PRODUCT_DESCRIPTION,PRODUCT_IMAGE_URL,PRODUCT_PRICE_IN_DARK,QUANTITY
PRODUCT_CODE2,PRODUCT_NAME2,PRODUCT_DESCRIPTION,PRODUCT_IMAGE_URL,PRODUCT_PRICE_IN_DARK,QUANTITY
PRODUCT_CODE3,PRODUCT_NAME3,PRODUCT_DESCRIPTION,PRODUCT_IMAGE_URL,PRODUCT_PRICE_IN_DARK,QUANTITY
PRODUCT_CODE4,PRODUCT_NAME4,PRODUCT_DESCRIPTION,PRODUCT_IMAGE_URL,PRODUCT_PRICE_IN_DARK,QUANTITY
PRODUCT_CODE5,PRODUCT_NAME5,PRODUCT_DESCRIPTION,PRODUCT_IMAGE_URL,PRODUCT_PRICE_IN_DARK,QUANTITY
PRODUCT_CODE6,PRODUCT_NAME6,PRODUCT_DESCRIPTION,PRODUCT_IMAGE_URL,PRODUCT_PRICE_IN_DARK,QUANTITY
```

There is an example file: `localhost-ark/ark-taco-shop-api/inventory-file-example.csv`

#### The client - Ark Taco Shop

To install the client, copy the `ark-taco-shop` plugin to the ARK core's `plugins` folder:

```sh
cd ~/core/plugins
mv ./localhost-ark/ark-taco-shop ./
```

##### Configuration

We will be using `testnet` as a local network to run ARK. To configure it, modify the file `core/packages/core/lib/config/testnet/plugins.js` and copy the configuration object from of the file `localhost-ark/ark-taco-shop/src/defaults.ts`, and add it like showed below:

```js
{
  '@arkecosystem/core-event-emitter': {},
  '@arkecosystem/core-config': {},
  ...
  },
  '@mlh/ark-taco-shop': {
    enabled: process.env.ARK_TACO_SHOP_ENABLED || true,
    server: {
        enabled: process.env.ARK_TACO_SHOP_SERVER_ENABLED || true,
        host: process.env.ARK_TACO_SHOP_SERVER_HOST || "0.0.0.0",
        port: process.env.ARK_TACO_SHOP_SERVER_PORT || 3000,
    },
    inventoryApi: {
        sender: process.env.ARK_TACO_SHOP_INVENTORY_SENDER_ADDRESS || "AJjv7WztjJNYHrLAeveG5NgHWp6699ZJwD",
        passphrase:
            process.env.ARK_TACO_SHOP_INVENTORY_SENDER_PASSPHRASE ||
            "decide rhythm oyster lady they merry betray jelly coyote solve episode then",
        recipient: process.env.ARK_TACO_SHOP_INVENTORY_RECIPIENT || "ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo",
        uri: process.env.ARK_TACO_SHOP_INVENTORY_API_URL || "http://0.0.0.0:5000/api",
    },
}
```

Notes:

- Make sure to change the `inventoryApi.uri` property to set to the IP address of the `server`.
- Make sure to configure the `inventoryApi.sender` and `inventoryApi.passphrase` properly. You can find valid passphrases in the testnet config file `core/packages/core/bin/config/testnet/delegates.json`. Use [ARK Desktop Wallet](https://github.com/ArkEcosystem/desktop-wallet/releases) to import the passphare and get the wallet's address.
- To register the client as a node of the ARK network, change the file `core/packages/core/bin/config/testnet/peers.json` and add server's ip to the list.

##### Install dependencies

```sh
cd ~/core
yarn setup
```

##### Run the application

```sh
cd ~/core/packages/core
yarn full:testnet
```

The output may be a bit verbose, but you should see the message `ark-taco-shop available and listening on port 3000` in it.

To test it, access the frontend using the link `http://0.0.0.0:3000`. You should see the homepage.
