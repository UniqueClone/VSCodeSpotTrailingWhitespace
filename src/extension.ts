import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        updateDecorations(); // initial run
        vscode.window.onDidChangeActiveTextEditor(editor => {
            editor = editor;
            if (editor) {
                updateDecorations();
            }
        }, null, context.subscriptions);

        vscode.workspace.onDidChangeTextDocument(event => {
            if (editor && event.document === editor.document) {
                updateDecorations();
            }
        }, null, context.subscriptions);
    }


    /**
     * Searches through all lines in the active editor and checks for trailing whitespace.
     * If trailing whitespace is found, it is highlighted.
     * @returns void
     */
    function updateDecorations() {
        if(!editor) {
            return;
        }

        const text = editor.document.getText();
        const lines = text.split('\n');

        // Create a decoration type that we will use to decorate the line
        // TODO - Make this configurable
        const decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
            isWholeLine: false,
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        // Create an empty list of decorations
        const decorations: vscode.DecorationOptions[] = [];

        let found = false;

        // Loop through each line and check for trailing whitespace
        lines.forEach((lineText, lineNumber) => {
            // Check for trailing whitespace. Regex checks for space or tab at the end of the line
            const trailingWhitespaceMatch = lineText.match(/[ \t]+$/m);

            if (trailingWhitespaceMatch) {
                found = true;
                console.log(`Found trailing whitespace on line ${lineNumber + 1} at position ${trailingWhitespaceMatch.index}`);

                const startPos = new vscode.Position(lineNumber, trailingWhitespaceMatch.index ? trailingWhitespaceMatch.index : 0);
                const endPos = new vscode.Position(lineNumber, lineText.length);
                const range = new vscode.Range(startPos, endPos);

                // Add the decoration to the list
                decorations.push({ range });
            }
            
        });

        // Show a message if no trailing whitespace was found
        if(!found) {
            console.log('No trailing whitespace found.');
            vscode.window.showInformationMessage('No trailing whitespace found.');
        }

        // Update the decorations for this editor
        editor.setDecorations(decorationType, decorations);
    }
}

export function deactivate() {}
