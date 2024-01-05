#!/usr/bin/bash
# does the following:
# - hhd Decky Plugin

DECKY="$HOME/homebrew/plugins"
if [ ! -d $DECKY ]; then
  echo "Failed to find decky at: "
  echo $DECKY
  exit -1
fi

echo "Removing previous hhd-decky if it exists"
rm -rf "$DECKY/hhd-decky"

echo "Installing hhd-decky"
curl -L $(curl -s "https://api.github.com/repos/hhd-dev/hhd-decky/releases/latest" | grep "browser_download_url" | cut -d '"' -f 4) -o /tmp/__hhd-decky.tar.gz
tar -xzf /tmp/__hhd-decky.tar.gz -C $DECKY

# install complete, remove build artifact
rm  /tmp/__hhd-decky.tar.gz

# Restart service
systemctl restart plugin_loader.service

echo "Installation complete"