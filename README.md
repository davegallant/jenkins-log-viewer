# jenkins-log-viewer (for vscode)

A [vscode](https://code.visualstudio.com/) extension for viewing Jenkins job logs.

## Features

Fetches logs from jenkins and does some colour highlighting on errors.

![jenkins_log_viewer](https://user-images.githubusercontent.com/4519234/42071590-066bd3f8-7b2a-11e8-926c-7fa58dc9f2d3.gif)


## Extension Settings

This extension contributes the following settings:

- `jenkins.jenkinsPath`: set to specific job name (i.e. "https://my-jenkins.internal/job//pytest/")

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
