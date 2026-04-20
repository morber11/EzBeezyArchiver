# EasyArchiver

## Description

**EasyArchiver** is a user-friendly tool designed for archiving files using Archive.is.

At the moment this is still in an experimental phase and is still awaiting release to the Chrome Web Store

## Links
### Firefox
- https://addons.mozilla.org/en-US/firefox/addon/easy-archive-is-archiver/

## Building

To build the project, execute the `build.ps1` script. Builds all by default

To build for a specific version, add the parameter `firefox` or `chrome`.

This will create a new folder in the directory called `out` which contains the relevant files

It will also contain a .zip archive of all the relevant files.

For development, add the flag `-d` or `-dev` which will append the app name in the manifest with `[DEV]` to distuinguish it from preinstalled versions

## Manual Installation

After building the file, follow the steps below to add it to your browser:

### For Firefox:

1. Click on `Settings`.
2. Select `Add-ons`.
3. In the Add-ons manager, click the setting wheel and select `Install add-on from file`.
4. Drag and drop the `.zip` file into Firefox.

### For Chrome:

1. Click on `Settings`.
2. Select `Extensions`.
3. Enable `Developer mode` in the top right.
4. Click on `Load unpacked`.
5. Select the `out` folder.

## Troubleshooting

If you encounter any issues while using **EasyArchiver**, please refer to the following sections based on your browser:

### For Firefox:

1. Ensure that you have the latest version of Firefox installed.
2. Check if the add-on is enabled in `Add-ons` settings.
3. Try disabling `xpinstall.signatures.required` in `about:config`
4. If the problem persists, try reinstalling the add-on.

### For Chrome:

1. Ensure that you have the latest version of Chrome installed.
2. Check if the extension is enabled in `Extensions` settings.
3. If the problem persists, try reinstalling the extension.
