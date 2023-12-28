 #!/bin/bash

pnpm run build
sudo rm -r $HOME/homebrew/plugins/decky-hhd/
sudo cp -r $HOME/Development/decky-hhd/ $HOME/homebrew/plugins/
sudo systemctl restart plugin_loader.service
