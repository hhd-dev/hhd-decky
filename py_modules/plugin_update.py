import os
import stat
import decky_plugin
import subprocess
import urllib.request
import json
import ssl
import shutil

def recursive_chmod(path, perms):
    for dirpath, dirnames, filenames in os.walk(path):
        current_perms = os.stat(dirpath).st_mode
        os.chmod(dirpath, current_perms | perms)
        for filename in filenames:
            os.chmod(os.path.join(dirpath, filename), current_perms | perms)

def download_latest_build():
    # ssl._create_default_https_context = ssl._create_unverified_context
    url = "http://api.github.com/repos/hhd-dev/hhd-decky/releases/latest"

    gcontext = ssl.SSLContext()

    response = urllib.request.urlopen(url, context=gcontext)
    json_data = json.load(response)

    download_url = json_data.get("assets")[0].get("browser_download_url")

    decky_plugin.logger.info(download_url)

    file_path = '/tmp/hhd-decky.tar.gz'

    with urllib.request.urlopen(download_url, context=gcontext) as response, open(file_path, 'wb') as output_file:
        output_file.write(response.read())
        output_file.close()

    return file_path

def ota_update():
    downloaded_filepath = download_latest_build()

    if os.path.exists(downloaded_filepath):
        hhd_plugin_dir = f'{decky_plugin.DECKY_USER_HOME}/homebrew/plugins/hhd-decky'

        try:
            # add write perms to directory
            recursive_chmod(hhd_plugin_dir, stat.S_IWUSR)

            # remove old plugin
            shutil.rmtree(hhd_plugin_dir)
        except Exception as e:
            decky_plugin.logger.error(f'ota error during removal of old plugin {e}')

        try:
            # extract files to decky plugins dir
            shutil.unpack_archive(downloaded_filepath, f'{decky_plugin.DECKY_USER_HOME}/homebrew/plugins')

            # cleanup downloaded files
            os.remove(downloaded_filepath)
        except Exception as e:
            decky_plugin.logger.error(f'error during ota file extraction {e}')

        cmd = f'echo "systemctl restart plugin_loader.service" | sh'

        result = subprocess.run(cmd, shell=True, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        return result
