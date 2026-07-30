# EzBeezyArchiver

## Description

**EzBeezyArchiver** is a user-friendly tool designed for archiving files using Archive.is

![image](https://files.catbox.moe/lc9hkg.png)

## Links

[Chrome](https://chromewebstore.google.com/detail/easy-beezy-archiver/cicfbmoilmbadgfjfedlbihpflnbpaji)

[Firefox](https://addons.mozilla.org/en-US/firefox/addon/ezbeezyarchiver/)

## Configuration

EzBeezyArchiver stores runtime settings in browser storage under the key `ezBeezyArchiver.config`.
The configuration object contains:

- `name`: preset name, for example `"archive.is"`
- `serviceUrl`: archive service host, for example `https://archive.is`
- `queryParameters`: query string prefix, for example `/?run=1&url=`

The default settings are:

```json
{
  "name": "archive.is",
  "serviceUrl": "https://archive.is",
  "queryParameters": "/?run=1&url="
}
```

Alternative services include `https://archive.li` and `https://archive.ph`.

## Options Page

Configure the archive service from the extension options page. Open the extension details page and click "Options" or "Preferences"

Choose a preset or enter custom values for:

- `name`: preset name
- `serviceUrl`: archive service host
- `queryParameters`: query string prefix

The options UI saves settings to `ezBeezyArchiver.config` in browser storage

## Building

Ensure dependencies are installed:

```sh
npm install
```

### Development build

```sh
npm run build
```

Creates `out/firefox/` and `out/chrome/` directories with the extension files, plus `.zip` archives

The app name is prefixed with `[DEV]` and the extension ID is suffixed for Firefox so dev and production versions can both be loaded in the same browser

### Production build

```sh
npm run build:prod
```

Runs lint first. If lint fails, the build fails

All builds output to `out/{target}/` and create a relevant `.zip` archive

## Manual Installation

After building, install the output as follows:

### Firefox Installation

1. Open `about:debugging#/runtime/this-firefox` in Firefox
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` from `out/firefox/`

### Chrome Installation

1. Open `chrome://extensions` in Chrome
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `out/chrome/` folder

## Troubleshooting

If you encounter any issues while using **EzBeezyArchiver**, please refer to the following sections based on your browser:

### Firefox

1. Ensure that you have the latest version of Firefox installed.
2. Check if the add-on is enabled in `Add-ons` settings.
3. Try disabling `xpinstall.signatures.required` in `about:config`
4. If the problem persists, try reinstalling the add-on.

### Chrome

1. Ensure that you have the latest version of Chrome installed.
2. Check if the extension is enabled in `Extensions` settings.
3. If the problem persists, try reinstalling the extension.
