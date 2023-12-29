 #!/bin/bash
# for localhost dev purposes
pnpm run build
sudo rm -r $HOME/homebrew/plugins/decky-hhd/
sudo rm -rf $HOME/homebrew/logs/decky-hhd/*
sudo cp -r $HOME/Development/decky-hhd/ $HOME/homebrew/plugins/
sudo systemctl restart plugin_loader.service
