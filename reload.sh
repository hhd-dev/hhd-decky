 #!/bin/bash
# for localhost dev purposes
pnpm run build
sudo rm -r $HOME/homebrew/plugins/hhd-decky/
sudo rm -rf $HOME/homebrew/logs/hhd-decky/*
sudo cp -r ../hhd-decky/ $HOME/homebrew/plugins/
sudo systemctl restart plugin_loader.service
