## Deploying with Ark Deployer

### Create a fork of ark core and ark explorer

More information about this process [here](https://deployer.ark.dev/prepare/preparing-github/)

### Create a server

![](./img/800-server.png)

You can find more information about Server Requirements [here](https://deployer.ark.dev/prepare/getting-started/)

_Note: Make sure your server has access to your Github account. If you have a pub/private key configured, you won't be able to use email/password auth. https://help.github.com/en/articles/connecting-to-github-with-ssh_


### Prepare your server for the deployment

Create a new user to deploy/manage your node.

```sh
adduser bridgechain
usermod -aG sudo bridgechain
su bridgechain
```

![](./img/900-prepare-server.png)

More information about this [here](https://deployer.ark.dev/prepare/preparing-your-server/)

### Preparing the deployment script

#### Go to https://deployer.ark.io/ and launch a new deployer.

![](./img/1000-launch-deployer.png)

#### Click on "Create", then select the "Basic" level

![](./img/1100-select-basic.png)

#### Provide the information about your bridgechain

![](./img/1200-bridgechain-info.png)

#### Provide the information about your forks of repo and explorer

![](./img/1300-github-repo.png)

_Note: If your github account has a pub/private key, make sure to use the ssh address of your repo_

#### Configure your server as a mainnet peer

![](./img/1400-mainnet-peer.png)

#### Configure your server as a devnet peer

![](./img/1500-devnet-peer.png)

#### Get the deployment script

![](./img/1600-view-script.png)

And copy the content

![](./img/1700-script-content.png)


### Executing the deployment script

#### Create the deployment script

Connect to your server, then execute the commands below:

```sh
su bridgechain
cd ~
nano setup-deployer.sh 

# paste the content and save the file
```

![](./img/1800-create-script.png)

#### Execute the deployment script

```sh
su bridgechain
cd ~
bash setup-deployer.sh
```

![](./img/1900-execute-script.png)

At the end, choose `testnet` as the network to run.

![](./img/2000-choose-testnet.png)

Make sure to scroll back, after execution finishes, and save the output of the wallets as we will need it to configure our taco-shop api.

![](./img/2100-wallet-output.png)



Your server will restart, wait a few minutes before you can test it.


More information about this process [here](https://deployer.ark.dev/deploy/transferring-and-executing-script/).


### Create a wallet and make some transferences to it

#### Add your network to Ark Desktop Wallet

![](./img/2200-add-bridgechain.png)

More information about this process [here](https://deployer.ark.dev/deploy/adding-bridgechain-to-ark-desktop-wallet/#adding-network-to-ark-desktop-wallet)

#### Create Profile With Your Network in ARK Desktop Wallet

![](./img/2300-create-profile.png)

More information about this process [here](https://deployer.ark.dev/deploy/adding-bridgechain-to-ark-desktop-wallet/#creating-profile-with-your-network-in-ark-desktop-wallet)

#### Importing the Genesis Wallet Address

Here you will use the information you saved from the installer output. Make sure you use the output for the `testnet` network.

![](./img/2400-import-genesis.png)

[](https://deployer.ark.dev/deploy/importing-genesis-addresses-and-adding-forgers/#importing-genesis-wallet-address)


#### Create a wallet for the taco-plugins

* Click on the profile image
* Click on Create Wallet
* Choose one of the provided address (Save this value)
* Click next
* Copy and save your passphrase
* Validate the flow
* Name your wallet
* Save

![](./img/2500-taco-wallet.png)

More information about this process [here](https://docs.ark.io/tutorials/usage-guides/how-to-use-ark-desktop-wallet.html#creating-or-importing-your-ark-wallet)

#### Send some tokens to your taco wallet

* Click on the wallets icon
* Select the genesis wallet
* Click on Send
* Use the taco wallet as the recipient
* Send 10000000
* Use the genesis passphrase (the one you saved from the installer output)

![](./img/2600-send-tokens.png)

You can confirm the taco wallet has received the tokens by selecting the taco wallet.

![](./img/2700-taco-wallet.png)

More information about this process [here](https://docs.ark.io/tutorials/usage-guides/how-to-use-ark-desktop-wallet.html#wallet-interface)

### Install the taco-shop plugins

Connect to your server, make sure you are using the bridgechain user, and cd into the home.

```sh
su bridgechain
cd ~
```

Clone the localhost-ark project and move the plugins to the expected folder.

```sh
cd ~/core-bridgechain/plugins
git clone --branch v0.0.1 https://github.com/MLH/localhost-ark
mv ./localhost-ark/ark-taco-shop-api ./
mv ./localhost-ark/ark-taco-shop ./
rm -rf localhost-ark
```

Install the plugins dependencies.

```sh
cd ~/core-bridgechain
yarn setup
```

The plugins should be listed in the output.

![](./img/2800-install-plugins.png)

### Configure the plugins

Edit the file `~/.config/mlh-ark-core/testnet/plugins.js` and add the following:

```JSON

        '@mlh/ark-taco-shop-api': {
                enabled: true,
                server: {
                        enabled: true,
                        host: "0.0.0.0",
                        port: 5000,
                },
        },
        '@mlh/ark-taco-shop': {
                enabled: true,
                server: {
                        enabled: true,
                        host: "0.0.0.0",
                        port: 3000,
                },
                inventoryApi: {
                        sender: "REPLACE_THIS_VALUE_WITH_THE_TACO_ADDRESS",
                        passphrase: "REPLACE_THIS_VALUE_WITH_THE_TACO_PASSPHRASE",
                        recipient:  "REPLACE_THIS_VALUE_WITH_THE_GENESIS_ADDRESS",
                        uri: "http://0.0.0.0:5000/api",
                },
        },
```

![](./img/2900-configure-plugins.png)

### Restart your Ark Core instance

```sh
pm2 restart all
```

![](./img/3000-pm2-restart.png)

### Check the logs to see if the taco plugins started

```sh
pm2 logs
```

![](./img/3100-pm2-logs.png)

### Add products to the inventory

Open http://YOUR_SERVER_ADDRESS:5000/inventory

![](./img/3200-add-inventory.png)

### Test the Taco Shop

Open http://YOUR_SERVER_ADDRESS:3000

![](./img/3300-taco-shop.png)