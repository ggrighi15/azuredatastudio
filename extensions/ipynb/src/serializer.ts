/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { nbformat } from '@jupyterlab/coreutils';
import * as detectIndent from 'detect-indent';
import * as vscode from 'vscode';
import { defaultNotebookFormat } from './constants';
import { createJupyterCellFromNotebookCell, getPreferredLanguage, jupyterNotebookModelToNotebookData, pruneCell } from './helpers';

export class NotebookSerializer implements vscode.NotebookSerializer {
	public deserializeNotebook(content: Uint8Array, _token: vscode.CancellationToken): vscode.NotebookData {
		let contents = '';
		try {
			contents = new TextDecoder().decode(content);
		} catch {
		}

		let json: Partial<nbformat.INotebookContent>;
		try {
			json = contents ? (JSON.parse(contents) as Partial<nbformat.INotebookContent>) : {};
		} catch (e) {
			console.log(contents);
			console.log(e);
			throw e;
		}

		// Then compute indent from the contents
		const indentAmount = contents ? detectIndent(contents).indent : ' ';

		const preferredCellLanguage = getPreferredLanguage(json.metadata);
		// Ensure we always have a blank cell.
		if ((json.cells || []).length === 0) {
			json.cells = [
				{
					cell_type: 'code',
					execution_count: null,
					metadata: {},
					outputs: [],
					source: ''
				}
			];
		}

		// For notebooks without metadata default the language in metadata to the preferred language.
		if (!json.metadata || (!json.metadata.kernelspec && !json.metadata.language_info)) {
			json.metadata = json.metadata || { orig_nbformat: defaultNotebookFormat.major };
			json.metadata.language_info = json.metadata.language_info || { name: preferredCellLanguage };
		}

		const data = jupyterNotebookModelToNotebookData(
			json,
			preferredCellLanguage
		);
		data.metadata = data.metadata || {};
		data.metadata.indentAmount = indentAmount;

		return data;
	}

	public serializeNotebookDocument(data: vscode.NotebookDocument): string {
		return this.serialize(data);
	}

	public serializeNotebook(data: vscode.NotebookData, _token: vscode.CancellationToken): Uint8Array {
		return new TextEncoder().encode(this.serialize(data));
	}

	private serialize(data: vscode.NotebookDocument | vscode.NotebookData): string {
		const notebookContent: Partial<nbformat.INotebookContent> = data.metadata?.custom || {};
		notebookContent.cells = notebookContent.cells || [];
		notebookContent.nbformat = notebookContent.nbformat || 4;
		notebookContent.nbformat_minor = notebookContent.nbformat_minor || 2;
		notebookContent.metadata = notebookContent.metadata || { orig_nbformat: 4 };

		const cells = 'notebookType' in data ?
			data.getCells() :
			data.cells;

		notebookContent.cells = cells
			.map(cell => createJupyterCellFromNotebookCell(cell))
			.map(pruneCell);

		const indentAmount = data.metadata && 'indentAmount' in data.metadata && typeof data.metadata.indentAmount === 'string' ?
			data.metadata.indentAmount :
			' ';
		return JSON.stringify(notebookContent, undefined, indentAmount);
	}
}
