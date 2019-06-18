/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from 'vs/base/common/actions';
import { Command } from 'vs/editor/browser/editorExtensions';
import * as nls from 'vs/nls';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';
import { WebviewEditor } from 'vs/workbench/contrib/webview/browser/webviewEditor';

export class ShowWebViewEditorFindWidgetCommand extends Command {
	public static readonly ID = 'editor.action.webvieweditor.showFind';

	public runCommand(accessor: ServicesAccessor, args: any): void {
		const webViewEditor = getActiveWebviewEditor(accessor);
		if (webViewEditor) {
			webViewEditor.showFind();
		}
	}
}

export class HideWebViewEditorFindCommand extends Command {
	public static readonly ID = 'editor.action.webvieweditor.hideFind';

	public runCommand(accessor: ServicesAccessor, args: any): void {
		const webViewEditor = getActiveWebviewEditor(accessor);
		if (webViewEditor) {
			webViewEditor.hideFind();
		}
	}
}

export class SelectAllWebviewEditorCommand extends Command {
	public static readonly ID = 'editor.action.webvieweditor.selectAll';

	public runCommand(accessor: ServicesAccessor, args: any): void {
		const webViewEditor = getActiveWebviewEditor(accessor);
		if (webViewEditor) {
			webViewEditor.selectAll();
		}
	}
}

export class CopyWebviewEditorCommand extends Command {
	public static readonly ID = 'editor.action.webvieweditor.copy';

	public runCommand(accessor: ServicesAccessor, args: any): void {
		const webViewEditor = getActiveWebviewEditor(accessor);
		if (webViewEditor) {
			webViewEditor.copy();
		}
	}
}

export class PasteWebviewEditorCommand extends Command {
	public static readonly ID = 'editor.action.webvieweditor.paste';

	public runCommand(accessor: ServicesAccessor, args: any): void {
		const webViewEditor = getActiveWebviewEditor(accessor);
		if (webViewEditor) {
			webViewEditor.paste();
		}
	}
}

export class CutWebviewEditorCommand extends Command {
	public static readonly ID = 'editor.action.webvieweditor.cut';

	public runCommand(accessor: ServicesAccessor, args: any): void {
		const webViewEditor = getActiveWebviewEditor(accessor);
		if (webViewEditor) {
			webViewEditor.cut();
		}
	}
}

export class UndoWebviewEditorCommand extends Command {
	public static readonly ID = 'editor.action.webvieweditor.undo';

	public runCommand(accessor: ServicesAccessor, args: any): void {
		const webViewEditor = getActiveWebviewEditor(accessor);
		if (webViewEditor) {
			webViewEditor.undo();
		}
	}
}

export class RedoWebviewEditorCommand extends Command {
	public static readonly ID = 'editor.action.webvieweditor.redo';

	public runCommand(accessor: ServicesAccessor, args: any): void {
		const webViewEditor = getActiveWebviewEditor(accessor);
		if (webViewEditor) {
			webViewEditor.redo();
		}
	}
}

export class ReloadWebviewAction extends Action {
	static readonly ID = 'workbench.action.webview.reloadWebviewAction';
	static readonly LABEL = nls.localize('refreshWebviewLabel', "Reload Webviews");

	public constructor(
		id: string,
		label: string,
		@IEditorService private readonly editorService: IEditorService
	) {
		super(id, label);
	}

	public run(): Promise<any> {
		for (const webview of this.getVisibleWebviews()) {
			webview.reload();
		}
		return Promise.resolve(true);
	}

	private getVisibleWebviews() {
		return this.editorService.visibleControls
			.filter(control => control && (control as WebviewEditor).isWebviewEditor)
			.map(control => control as WebviewEditor);
	}
}

function getActiveWebviewEditor(accessor: ServicesAccessor): WebviewEditor | null {
	const editorService = accessor.get(IEditorService);
	const activeControl = editorService.activeControl as WebviewEditor;
	return activeControl.isWebviewEditor ? activeControl : null;
}