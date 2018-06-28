import vscode = require("vscode");

export function getJenkinsPath(): string {
  return resolveJenkinsPath();
}

function resolveJenkinsPath(): string {
  let jenkinsPath =
    vscode.workspace.getConfiguration("jenkins")["jenkinsPath"] || "";
  return jenkinsPath;
}
