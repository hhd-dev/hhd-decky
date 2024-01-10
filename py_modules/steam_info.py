import os

PLUGIN_USER = os.environ["DECKY_USER"]

STEAM_PID = f"/home/{PLUGIN_USER}/.steam/steam.pid"

def is_steamdeck_mode():
    pid = None
    try:
        with open(STEAM_PID) as f:
            pid = f.read().strip()

        steam_cmd_path = f"/proc/{pid}/cmdline"
        if not os.path.exists(steam_cmd_path):
            return False

        # Use this and line to determine if Steam is running in DeckUI mode.
        with open(steam_cmd_path, "rb") as f:
            steam_cmd = f.read()
        is_deck_ui = b"-steamdeck" in steam_cmd
        if not is_deck_ui:
            return False
    except Exception as e:
        return False
    return True