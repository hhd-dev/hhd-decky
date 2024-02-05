#!/usr/bin/env bash
# does the following:
# - hhd Decky Plugin
VERSION=${VERSION:-"LATEST"}
if [ "$EUID" -eq 0 ]
  then echo "Please do not run as root"
  exit
fi


echo "removing previous install if it exists"

cd $HOME

sudo rm -rf "$HOME/homebrew/plugins/hhd-decky"

echo "installing hhd plugin"

FINAL_URL='https://api.github.com/repos/hhd-dev/hhd-decky/releases/latest'
if [ $VERSION != "LATEST" ] ; then
  FINAL_URL="https://api.github.com/repos/hhd-dev/hhd-decky/releases/tags/v${VERSION}"
fi

curl -L $(curl -s "${FINAL_URL}" | grep "browser_download_url" | cut -d '"' -f 4) -o $HOME/hhd-decky.tar.gz
sudo tar -xzf hhd-decky.tar.gz -C $HOME/homebrew/plugins

# install complete, remove build dir
rm  $HOME/hhd-decky.tar.gz
sudo systemctl restart plugin_loader.service

echo "Installation complete"
