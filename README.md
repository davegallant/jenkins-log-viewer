# jenkins-log-viewer (for vscode)

A [vscode](https://code.visualstudio.com/) extension for viewing Jenkins job logs.

## Features

Fetches logs from jenkins and does some colour highlighting on errors.

## Extension Settings

This extension contributes the following settings:

- `jenkins.jenkinsPath`: set to specific job name (i.e. "https://jenkins.com/job/CAPE/job/tests/job/pytest/")

## Usage

On the first line of an active editor tab, have the build number you need (i.e. 1030) and then press:

`CTRL+SHIFT+P`

search for _"Jenkins: Logs"_

Then an attempt to fetch the logs and insert into the editor will happen.

## Compile extension into .VSIX

```bash
# Make sure node/npm is installed
npm install -g vsce
vsce package
```

A .vsix file is then created which can be privately shared and installed into the editor.

More documention [here](https://code.visualstudio.com/docs/extensions/publish-extension).
