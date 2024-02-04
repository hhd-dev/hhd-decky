#!/usr/bin/bash
# does the following:
# - Update hhd-decky Decky Plugin
UPDATE_FILE="/tmp/hhd-decky.tar.gz"

if [ ! -f $UPDATE_FILE ]; then
  echo "Failed to find downloaded plugin"
  exit -1
fi

DECKY_DIR="$HOME/homebrew/plugins"
INSTALLED_DIR="$DECKY_DIR/hhd-decky"

if [ ! -d "$DECKY_DIR" ]; then
  echo "Failed to find DECKY_DIR at: "
  echo $DECKY_DIR
  exit -1
fi

rm -rf "$INSTALLED_DIR"

tar -xzf "$UPDATE_FILE" -C "$DECKY_DIR"

# install complete, remove files
rm  -rf $UPDATE_FILE

systemctl restart plugin_loader.service
