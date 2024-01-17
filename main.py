import os

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin
import plugin_settings
import steam_info
import yaml

PLUGIN_USER = os.environ["DECKY_USER"]
HHD_TOKEN_PATH = f"/home/{PLUGIN_USER}/.config/hhd/token"
HHD_STATE_PATH = f"/home/{PLUGIN_USER}/.config/hhd/state.yml"
DEFAULT_PORT = 5335

class Plugin:
    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    # checks if steam is running as -steamdeck
    async def is_steamdeck_mode(self):
        return steam_info.is_steamdeck_mode()

    async def log_to_backend(self, info):
        decky_plugin.logger.info(info)
    
    async def retrieve_plugin_version(self):
        return f'{decky_plugin.DECKY_PLUGIN_VERSION}'

    async def retrieve_http_port(self):
        try:
            decky_plugin.logger.info(f"retrieving http_port from {HHD_STATE_PATH}")

            if os.path.exists(HHD_STATE_PATH):
                hhd_state = open(HHD_STATE_PATH, 'r').read()
                yaml_object = yaml.safe_load(hhd_state)
                port = yaml_object.get('hhd').get('http').get('port')
                decky_plugin.logger.info(f"http_port {port}")
                if port == "default":
                    return DEFAULT_PORT
                return port or DEFAULT_PORT
        except Exception as e:
            decky_plugin.logger.error(f"failure retrieving hhd state {e}")
            return False

    async def retrieve_hhd_token(self):
        try:
            decky_plugin.logger.info(f"retrieving token from {HHD_TOKEN_PATH}")

            if os.path.exists(HHD_TOKEN_PATH):
                token = open(HHD_TOKEN_PATH, 'r').read()
                decky_plugin.logger.info(f"token {token}")
                return token
        except Exception as e:
            decky_plugin.logger.error(f"failure retrieving token {e}")
            return False
        
    async def get_settings(self):
        try:
            return plugin_settings.get_settings()
        except Exception as e:
            decky_plugin.logger.error(f"failure retrieving settings {e}")
            return False

    async def set_setting(self, name, value):
        try:
            plugin_settings.set_setting(name, value)
            return True
        except Exception as e:
            decky_plugin.logger.error(f"failure saving setting {name}={value} {e}")
            return False

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(os.path.join(decky_plugin.DECKY_USER_HOME,
                                               ".config", "decky-template", "template.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"))
