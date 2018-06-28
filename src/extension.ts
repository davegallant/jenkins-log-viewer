"use strict";
import * as request from "request";
import * as vscode from "vscode";
import { getJenkinsPath } from "./util";

export function activate(context: vscode.ExtensionContext) {
  console.log("jenkins-log-viewer activated.");

  // this command has been defined in the package.json file
  let disposable = vscode.commands.registerCommand("extension.getLogs", () => {
    let activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
      console.log("No open editor");
      return;
    }

    // get build number from the first line
    let buildNumber = activeEditor.document.getText(
      new vscode.Range(new vscode.Position(0, 0), new vscode.Position(1, 0))
    );

    // strip any newlines or tabs
    buildNumber = buildNumber.replace(/(\s\r\n\t|\n|\r\t)/gm, "");

    if (isNaN(Number(buildNumber))) {
      // if buildNumber is not a valid integer
      vscode.window.showErrorMessage(buildNumber + " is not an integer.");
      return;
    }

    let jenkinsPath = getJenkinsPath();

    if (jenkinsPath === "") {
      vscode.window.showErrorMessage(
        "Unable to fetch jenkinsPath in settings."
      );
      return;
    }

    request(
      {
        method: "GET",
        uri: jenkinsPath + buildNumber + "/consoleText",
        rejectUnauthorized: false
      },
      (error, response, body) => {
        // body is the decompressed response body
        if (activeEditor) {
          activeEditor.edit(editBuilder => {
            editBuilder.delete(new vscode.Range(1, 0, 0, 123415));
          });
          activeEditor.insertSnippet(
            new vscode.SnippetString("\n\n" + body),
            new vscode.Position(1, 0)
          );
          vscode.window.showInformationMessage(
            "Loaded build number: " + buildNumber
          );
        }
      }
    ).on("error", error => {
      vscode.window.showErrorMessage(error.message);
    });

    // decorator types
    // const successDecorationType = vscode.window.createTextEditorDecorationType({
    //   backgroundColor: "rgb(17, 234, 31)"
    // });
    const errorDecorationType = vscode.window.createTextEditorDecorationType({
      backgroundColor: "rgb(255, 18, 18)"
    });

    if (activeEditor) {
      triggerUpdateDecorations();
    }

    vscode.window.onDidChangeActiveTextEditor(
      editor => {
        activeEditor = editor;
        if (editor) {
          triggerUpdateDecorations();
        }
      },
      null,
      context.subscriptions
    );

    vscode.workspace.onDidChangeTextDocument(
      event => {
        if (activeEditor && event.document === activeEditor.document) {
          triggerUpdateDecorations();
        }
      },
      null,
      context.subscriptions
    );

    var timeout: NodeJS.Timer | null = null;
    function triggerUpdateDecorations() {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(updateDecorations, 500);
    }

    function updateDecorations() {
      if (!activeEditor) {
        return;
      }
      const regEx = /(ERROR|[1-9][0-9]* FAILED|FAILED\s+\[ \d+%]|FAILURE)+/gi;
      const text = activeEditor.document.getText();
      const errorsFound: vscode.DecorationOptions[] = [];

      let match;

      while ((match = regEx.exec(text))) {
        const matchedLine = activeEditor.document.positionAt(match.index);

        const startPos = new vscode.Position(matchedLine.line, 0);
        const endPos = new vscode.Position(matchedLine.line + 1, 0);

        const decoration = {
          range: new vscode.Range(startPos, endPos)
        };
        errorsFound.push(decoration);
      }
      activeEditor.setDecorations(errorDecorationType, errorsFound);
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
