# Decky HHD

Decky Frontend for HHD

# Requirements

- latest version of HHD installed and running
- HHD web server enabled
  - edit `$HOME/.config/hhd/state.yml`, change `enable` under `http` to `true`
- verify the webserver is working by going to `localhost:5335` in a web browser, you should be greeted with a basic hhd webpage

# Install

### Prerequisites

Decky Loader must already be installed.

### Quick Install

run the following in terminal, then reboot:

```
curl -L https://github.com/aarron-lee/decky-hhd/raw/main/install.sh | sh
```

### Manual Install

Download the latest release from the [releases page](https://github.com/aarron-lee/decky-hhd/releases)

Unzip the `tar.gz` file, and move the `decky-hhd` folder to your `$HOME/homebrew/plugins` directory

then run:

```
sudo systemctl restart plugin_loader.service
```

If the plugin didn't show up in Decky, restart your machine

## Manual build

Dependencies:

- Node.js v16.14+ and pnpm installed

```bash
git clone https://github.com/aarron-lee/decky-hhd.git

cd decky-hhd

# if pnpm not already installed
npm install -g pnpm

pnpm install
pnpm update decky-frontend-lib --latest
pnpm run build
```

Afterwards, you can place the entire `decky-hhd` folder in the `~/homebrew/plugins` directly, then restart your plugin service

```bash
sudo systemctl restart plugin_loader.service

sudo systemctl reboot
```

You can see an example in [reload.sh](./reload.sh)
